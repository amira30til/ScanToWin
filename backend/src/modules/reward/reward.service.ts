import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  RewardMessages,
  ShopMessages,
} from 'src/common/constants/messages.constants';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ApiResponse } from 'src/common/utils/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { RewardCategory } from '../reward-category/entities/reward-category.entity';
import { Shop } from '../shops/entities/shop.entity';
import { Reward } from './entities/reward.entity';
import { RewardStatus } from './enums/reward-status.enums';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { log } from 'console';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(RewardCategory)
    private readonly rewardCategoryRepository: Repository<RewardCategory>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(ActiveGameAssignment)
    private readonly activeGameAssignmentRepository: Repository<ActiveGameAssignment>,
  ) {}
  async upsertMany(shopId: string, dtoArr: CreateRewardDto[]) {
    try {
      /* -----------------------------------------------------------
       * 0.  Load shop + current rewards
       * --------------------------------------------------------- */
      const shop = await this.shopRepository.findOne({
        where: { id: shopId },
        relations: ['rewards'],
      });

      if (!shop || !shopId) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }

      /* -----------------------------------------------------------
       * 1.  Duplicate‑name check (case‑insensitive)
       * --------------------------------------------------------- */
      const nameSet = new Set<string>();
      for (const dto of dtoArr) {
        const lower = dto.name.trim().toLowerCase();
        if (nameSet.has(lower)) {
          throw new BadRequestException(`Duplicate reward name: "${dto.name}"`);
        }
        nameSet.add(lower);
      }

      /* -----------------------------------------------------------
       * 2.  Per‑item validation (percentage, nbRewardTowin, …)
       * --------------------------------------------------------- */
      for (const dto of dtoArr) {
        /** percentage 1 – 100 */
        if (!dto.percentage || dto.percentage <= 0 || dto.percentage > 100) {
          throw new BadRequestException(
            `Invalid percentage for "${dto.name}": must be between 1 and 100`,
          );
        }

        /** unlimited ↔ nbRewardTowin */
        if (dto.isUnlimited && dto.nbRewardTowin != 0) {
          throw new BadRequestException(
            `Unlimited reward "${dto.name}" cannot have nbRewardTowin set`,
          );
        }
        if (
          !dto.isUnlimited &&
          (dto.nbRewardTowin == null || dto.nbRewardTowin < 1)
        ) {
          throw new BadRequestException(
            `Reward "${dto.name}" must have a valid nbRewardTowin when not unlimited`,
          );
        }
      }

      /* -----------------------------------------------------------
       * 3.  Work out what will be created / updated / deleted
       *     (nothing in this block changed from your original code)
       * --------------------------------------------------------- */
      const dbRewards = shop.rewards ?? [];
      const incomingIds = new Set(dtoArr.filter((d) => d.id).map((d) => d.id!));

      const toDeleteIds = dbRewards
        .filter((r) => !incomingIds.has(r.id))
        .map((r) => r.id);
      const toCreateDtos = dtoArr.filter((d) => !d.id);
      const toUpdateDtos = dtoArr.filter((d) => d.id);

      /* -----------------------------------------------------------
       * 4.  ✨ NEW GLOBAL VALIDATIONS  ✨
       * --------------------------------------------------------- */

      /* 4.a – What will ACTIVE rewards look like _after_ the upsert? */
      const outgoingActiveDtos = dtoArr.filter(
        (d) => d.status === RewardStatus.ACTIVE,
      );
      const totalPct = outgoingActiveDtos.reduce(
        (sum, d) => sum + (d.percentage || 0),
        0,
      );

      if (outgoingActiveDtos.length > 0 && totalPct !== 100) {
        throw new BadRequestException(
          `Total percentage of ACTIVE rewards must equal 100 %. Current sum: ${totalPct} %`,
        );
      }

      /* 4.b – Guaranteed‑Win ⇒ at least one unlimited ACTIVE reward */
      const hasUnlimited = outgoingActiveDtos.some((d) => d.isUnlimited);
      if (shop.isGuaranteedWin && !hasUnlimited) {
        throw new ConflictException(
          `Pour un jeu 100 % gagnant, vous devez définir au moins un gain illimité ` +
            `(isUnlimited = true). Sinon, désactivez l’option 100 % gagnant.`,
        );
      }

      /* -----------------------------------------------------------
       * 5.  CREATE
       * --------------------------------------------------------- */
      const created = await Promise.all(
        toCreateDtos.map(async (d) => {
          const reward = this.rewardRepository.create({
            ...d,
            shopId,
            nbRewardTowin: d.isUnlimited ? null : d.nbRewardTowin,
            shop,
          });
          return this.rewardRepository.save(reward);
        }),
      );

      /* -----------------------------------------------------------
       * 6.  UPDATE
       * --------------------------------------------------------- */
      const updated = await Promise.all(
        toUpdateDtos.map(async (d) => {
          const reward = await this.rewardRepository.findOneBy({ id: d.id });
          if (!reward) throw new NotFoundException(`Reward not found: ${d.id}`);

          Object.assign(reward, {
            name: d.name,
            icon: d.icon,
            isUnlimited: d.isUnlimited,
            status: d.status,
            percentage: d.percentage,
            nbRewardTowin: d.isUnlimited ? null : d.nbRewardTowin,
            shop,
          });
          return this.rewardRepository.save(reward);
        }),
      );

      /* -----------------------------------------------------------
       * 7.  DELETE
       * --------------------------------------------------------- */
      if (toDeleteIds.length) {
        /** If the user is about to delete every ACTIVE reward,
         *  there will be no percentage left to check – that is OK
         *  because we already validated outgoingActiveDtos above. */
        await this.rewardRepository.delete(toDeleteIds);
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        created,
        updated,
        deleted: toDeleteIds,
        message: RewardMessages.REWARDS_UPSERT_DONE,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  private async validateRewardConfiguration(shop: Shop, isUnlimited: boolean) {
    // Get all active rewards (including those not being modified)
    const activeRewards = await this.rewardRepository.find({
      where: {
        shopId: shop.id,
        status: RewardStatus.ACTIVE,
      },
    });

    // If any active reward is limited, then new limited rewards are allowed
    const hasLimitedRewards = activeRewards.some((r) => !r.isUnlimited);

    if (!hasLimitedRewards && !isUnlimited) {
      throw new ConflictException(
        'Pour un jeu 100% gagnant, vous devez définir un gain illimité. ' +
          "Sinon, décochez l'option 100% gagnant pour inclure une case 'Perdu' dans le jeu.",
      );
    }
  }

  // 4. ADD this helper method for the validatePercentageSum used in individual upsert/update
  private async validatePercentageSum(
    shopId: string,
    newPercentage: number,
    newStatus: RewardStatus,
    excludeRewardId?: string,
  ): Promise<void> {
    // Get all active rewards for this shop (excluding the one being updated if applicable)
    const queryBuilder = this.rewardRepository
      .createQueryBuilder('reward')
      .where('reward.shopId = :shopId', { shopId })
      .andWhere('reward.status = :status', { status: RewardStatus.ACTIVE });

    if (excludeRewardId) {
      queryBuilder.andWhere('reward.id != :excludeRewardId', {
        excludeRewardId,
      });
    }

    const activeRewards = await queryBuilder.getMany();

    // Calculate current sum of percentages
    const currentSum = activeRewards.reduce(
      (sum, reward) => sum + (reward.percentage || 0),
      0,
    );

    // If the new/updated reward will be ACTIVE, include its percentage in the sum
    const newSum =
      newStatus === RewardStatus.ACTIVE
        ? currentSum + newPercentage
        : currentSum;

    // The sum must be exactly 100% for shops with active rewards
    if (newStatus === RewardStatus.ACTIVE || activeRewards.length > 0) {
      if (newSum !== 100) {
        throw new BadRequestException(
          `Total percentage of active rewards must equal 100%. Current sum would be ${newSum}%`,
        );
      }
    }
  }

  async update(
    id: string,
    shopId: string,
    dto: UpdateRewardDto,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: { id, shop: { id: shopId } },
        relations: ['shop', 'shop.activeGameAssignment'],
      });

      if (!reward) {
        throw new NotFoundException(
          `Reward with ID '${id}' not found for this shop`,
        );
      }

      const shop = reward.shop;

      if (
        shop.isGuaranteedWin &&
        dto.isUnlimited === false &&
        reward.isUnlimited === true
      ) {
        const otherUnlimitedRewards = await this.rewardRepository.count({
          where: {
            shop: { id: shopId },
            isUnlimited: true,
            id: Not(id),
          },
        });

        if (otherUnlimitedRewards === 0) {
          throw new ConflictException(
            RewardMessages.CANNOT_REMOVE_LAST_UNLIMITED,
          );
        }
      }

      // if (dto.categoryId) {
      //   const category = await this.rewardCategoryRepository.findOne({
      //     where: { id: dto.categoryId },
      //   });
      //   if (!category) {
      //     throw new NotFoundException(
      //       RewardMessages.CATEGORY_NOT_FOUND(dto.categoryId),
      //     );
      //   }
      // }

      if (dto.name && dto.name !== reward.name) {
        const existingReward = await this.rewardRepository.findOne({
          where: { name: dto.name, shop: { id: shopId } },
        });
        if (existingReward) {
          throw new ConflictException(
            RewardMessages.REWARD_NAME_EXISTS(dto.name),
          );
        }
      }

      await this.rewardRepository.update(id, dto);

      const updatedReward = await this.rewardRepository.findOne({
        where: { id },
        relations: [/*'category'*/ 'shop'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        reward: updatedReward,
        message: RewardMessages.REWARD_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<ApiResponseInterface<Reward[]> | ErrorResponseInterface> {
    try {
      const skip = (page - 1) * limit;

      const queryOptions: any = {
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      };

      const [rewards, total] =
        await this.rewardRepository.findAndCount(queryOptions);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        rewards,
        total: total,
        message: RewardMessages.REWARDS_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async findAllByShop(
    shopId?: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponseInterface<Reward[]> | ErrorResponseInterface> {
    try {
      const skip = (page - 1) * limit;

      const queryOptions: any = {
        relations: [/*'category'*/ 'shop'],
        order: { createdAt: 'ASC' },
        skip,
        take: limit,
      };

      if (shopId) {
        queryOptions.where = { shop: { id: shopId } };
      }

      const [rewards, total] =
        await this.rewardRepository.findAndCount(queryOptions);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        rewards,
        total: total,
        message: RewardMessages.REWARDS_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOneById(
    id: string,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    const reward = await this.rewardRepository.findOne({
      where: { id },
      relations: [/*/*'category'*/ 'shop'],
    });

    if (!reward) {
      throw new NotFoundException(RewardMessages.REWARD_NOT_FOUND(id));
    }

    return ApiResponse.success(HttpStatusCodes.SUCCESS, {
      reward,
      message: RewardMessages.REWARD_RETRIEVED,
    });
  }

  async findOneByIdAndShop(
    id: string,
    shopId: string,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: {
          id,
          status: RewardStatus.ACTIVE,
          shopId,
        },
        relations: [/*'category'*/ 'shop'],
      });

      if (!reward) {
        throw new NotFoundException(RewardMessages.REWARD_NOT_FOUND(id));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        reward,
        message: RewardMessages.REWARD_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
    shopId: string,
  ): Promise<ApiResponseInterface<null> | ErrorResponseInterface> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: { id, shop: { id: shopId } },
      });

      if (!reward) {
        throw new NotFoundException(
          `Reward with ID '${id}' not found for this shop`,
        );
      }

      await this.rewardRepository.delete(id);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: null,
        message: RewardMessages.REWARD_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async findByStatus(status: RewardStatus, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [rewards, total] = await this.rewardRepository.findAndCount({
        where: { status },
        relations: [/*'category'*/ 'shop'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

      if (rewards.length === 0) {
        throw new NotFoundException(`No rewards found with status: ${status}`);
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        rewards,
        total,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  //////////////////////////////////////////////////////////////////

  async selectRandomReward(shopId: string): Promise<{
    success: boolean;
    statusCode: number;
    data: {
      reward: any | null;
      message: string;
    };
  }> {
    try {
      // 1. Make sure a game is active for this shop
      const activeGameAssignment =
        await this.activeGameAssignmentRepository.findOne({
          where: { shopId, isActive: true },
          relations: ['shop'],
        });

      if (!activeGameAssignment) {
        return {
          success: false,
          statusCode: 404,
          data: { reward: null, message: 'No active game found for this shop' },
        };
      }

      const shop = activeGameAssignment.shop;

      // 2. Handle guaranteed/percentage‑based win
      if (!shop.isGuaranteedWin) {
        const randomValue = Math.random() * 100;
        const winningChance = shop.winningPercentage ?? 50;

        if (randomValue > winningChance) {
          return {
            success: true,
            statusCode: 200,
            data: {
              reward: null,
              message: `Better luck next time! You had a ${winningChance}% chance to win.`,
            },
          };
        }
      }

      // 3. Fetch only rewards that belong to this shop and are available
      const shopRewards = await this.rewardRepository.find({
        where: [
          { shopId, isUnlimited: true, status: RewardStatus.ACTIVE },
          { shopId, nbRewardTowin: MoreThan(0), status: RewardStatus.ACTIVE },
        ],
      });

      if (shopRewards.length === 0) {
        return {
          success: true,
          statusCode: 200,
          data: {
            reward: null,
            message: 'No available rewards at the moment.',
          },
        };
      }

      // 4. Pick a reward by percentage
      const roll = Math.random() * 100;
      let cumulative = 0;
      let selectedReward: Reward | null = null;

      const totalPercent = shopRewards.reduce(
        (sum, r) => sum + r.percentage,
        0,
      );

      for (const r of shopRewards) {
        const normalizedPercent = (r.percentage / totalPercent) * 100;
        cumulative += normalizedPercent || 0;
        if (roll <= cumulative) {
          selectedReward = r;
          break;
        }
      }

      if (!selectedReward) {
        throw new BadRequestException(RewardMessages.NOT_SELECTED);
      }

      // 5. Update winner count / stock
      const update: Partial<Reward> = {
        winnerCount: (selectedReward.winnerCount ?? 0) + 1,
      };
      if (!selectedReward.isUnlimited) {
        update.nbRewardTowin = (selectedReward.nbRewardTowin ?? 0) - 1;
      }

      await this.rewardRepository.update({ id: selectedReward.id }, update);
      const finalReward = await this.rewardRepository.findOne({
        where: { id: selectedReward.id },
      });

      return {
        success: true,
        statusCode: 201,
        data: {
          reward: {
            ...finalReward,
            isActive: finalReward?.status === RewardStatus.ACTIVE,
          },
          message: shop.isGuaranteedWin
            ? 'Reward randomly chosen successfully'
            : `Congratulations! You won with ${shop.winningPercentage}% chance!`,
        },
      };
    } catch (err) {
      console.error('Error in selectRandomReward:', err);
      return {
        success: false,
        statusCode: 500,
        data: { reward: null, message: 'Error selecting reward' },
      };
    }
  }
  async getRewardStatus(shopId: string): Promise<any> {
    const activeGameAssignment =
      await this.activeGameAssignmentRepository.findOne({
        where: {
          shopId: shopId,
          isActive: true,
        },
        relations: ['rewards', 'shop'],
      });

    if (!activeGameAssignment) {
      throw new NotFoundException(`No active game found for shop: ${shopId}`);
    }

    return {
      shopId,
      gameAssignmentId: activeGameAssignment.id,
      isGuaranteedWin: activeGameAssignment.shop.isGuaranteedWin,
      winningPercentage: activeGameAssignment.shop.winningPercentage,
      rewards: activeGameAssignment.rewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        isUnlimited: reward.isUnlimited,
        initialCount: reward.nbRewardTowin,
        winnersCount: reward.winnerCount,
        status: reward.status,
      })),
    };
  }
}
