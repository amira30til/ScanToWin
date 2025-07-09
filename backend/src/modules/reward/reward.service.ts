import {
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
import { MoreThan, Not, Repository } from 'typeorm';
import { RewardCategory } from '../reward-category/entities/reward-category.entity';
import { Shop } from '../shops/entities/shop.entity';
import { Reward } from './entities/reward.entity';
import { RewardStatus } from './enums/reward-status.enums';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';

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
    const shop = await this.shopRepository.findOne({
      where: { id: shopId },
      relations: ['rewards'],
    });
    if (!shop) throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));

    const dbRewards = shop.rewards ?? [];
    const incomingIds = new Set(dtoArr.filter((d) => d.id).map((d) => d.id!));

    const toDelete = dbRewards
      .filter((r) => !incomingIds.has(r.id))
      .map((r) => r.id);
    const toCreate = dtoArr.filter((d) => !d.id);
    const toUpdate = dtoArr.filter((d) => d.id);

    // CREATE
    const created = await Promise.all(
      toCreate.map(async (d) => {
        await this.validateRewardConfiguration(shop, d.isUnlimited ?? false);
        return this.rewardRepository.save(
          this.rewardRepository.create({ ...d, shop }),
        );
      }),
    );

    // UPDATE
    const updated = await Promise.all(
      toUpdate.map(async (d) => {
        const r = await this.rewardRepository.findOneBy({ id: d.id });
        if (!r) {
          throw new NotFoundException(`Reward not found: ${d.id}`);
        }
        Object.assign(r, {
          name: d.name,
          icon: d.icon,
          isUnlimited: d.isUnlimited,
          status: d.status,
          nbRewardTowin: d.nbRewardTowin,
          percentage: d.percentage,
        });

        return this.rewardRepository.save(r);
      }),
    );

    // DELETE
    if (toDelete.length) await this.rewardRepository.delete(toDelete);

    return ApiResponse.success(HttpStatusCodes.SUCCESS, {
      created,
      updated,
      deleted: toDelete,
      message: RewardMessages.REWARDS_UPSERT_DONE,
    });
  }

  private async validateRewardConfiguration(
    shop: Shop,
    isUnlimited: boolean,
  ): Promise<void> {
    if (shop.isGuaranteedWin && !isUnlimited) {
      const hasUnlimitedReward = await this.rewardRepository.findOne({
        where: {
          shop: { id: shop.id },
          isUnlimited: true,
        },
      });

      if (!hasUnlimitedReward) {
        throw new ConflictException(
          RewardMessages.GUARANTEED_WIN_REQUIRES_UNLIMITED,
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
        order: { createdAt: 'DESC' },
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
      console.log('id shop', shopId);
      console.log('id reward', id);

      const reward = await this.rewardRepository.findOne({
        where: {
          id,
          status: RewardStatus.ACTIVE,
          shopId,
        },
        relations: [/*'category'*/ 'shop'],
      });
      console.log('aaaaaaaaaa', reward);

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
      // ------------------------------------------------------------
      // 1. Still make sure a game is active for this shop
      // ------------------------------------------------------------
      const activeGameAssignment =
        await this.activeGameAssignmentRepository.findOne({
          where: { shopId, isActive: true },
          relations: ['shop'], // ← ‘rewards’ no longer needed here
        });

      if (!activeGameAssignment) {
        return {
          success: false,
          statusCode: 404,
          data: { reward: null, message: 'No active game found for this shop' },
        };
      }

      const shop = activeGameAssignment.shop;

      // ------------------------------------------------------------
      // 2. Handle guaranteed/percentage‑based win exactly as before
      // ------------------------------------------------------------
      if (!shop.isGuaranteedWin) {
        const randomValue = Math.random() * 100;
        const winningChance = shop.winningPercentage ?? 50; // default 50 %

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

      // ------------------------------------------------------------
      // 3. ↓ NEW – fetch only rewards that belong to this shop
      // ------------------------------------------------------------
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

      // Optional: if you prefer the old in‑memory filter instead of SQL, do
      // const shopRewards = (await this.rewardRepository.find({ where: { shopId, status: RewardStatus.ACTIVE } }))
      //   .filter(r => r.isUnlimited || r.nbRewardTowin > 0);

      // ------------------------------------------------------------
      // 4. Pick a reward by normalised percentage
      // ------------------------------------------------------------
      const totalPercent =
        shopRewards.reduce((sum, r) => sum + (r.percentage ?? 0), 0) || 100;
      const roll = Math.random() * 100;

      let cumulative = 0;
      let selectedReward: Reward | null = null;

      for (const r of shopRewards) {
        cumulative += ((r.percentage ?? 0) / totalPercent) * 100;
        if (roll <= cumulative) {
          selectedReward = r;
          break;
        }
      }

      if (!selectedReward) {
        // Safety fallback
        return {
          success: true,
          statusCode: 200,
          data: { reward: null, message: 'No reward was selected.' },
        };
      }

      // ------------------------------------------------------------
      // 5. Update winner count / stock just like before
      // ------------------------------------------------------------
      const update: Partial<Reward> = {
        winnerCount: (selectedReward.winnerCount ?? 0) + 1,
      };
      if (!selectedReward.isUnlimited) {
        update.nbRewardTowin = selectedReward.nbRewardTowin - 1;
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
