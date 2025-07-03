import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  GameMessages,
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
import { Not, Repository } from 'typeorm';
import { RewardCategory } from '../reward-category/entities/reward-category.entity';
import { Shop } from '../shops/entities/shop.entity';
import { Reward } from './entities/reward.entity';
import { RewardStatus } from './enums/reward-status.enums';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';

interface RewardProbability {
  reward: Reward;
  probability: number;
  remainingCount: number;
  probabilityRange: { min: number; max: number };
}

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
  async create(
    dto: CreateRewardDto,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id: dto.shopId },
        relations: ['rewards'], 
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(dto.shopId));
      }

      await this.validateRewardConfiguration(shop, dto.isUnlimited ?? false);

      const duplicate = await this.rewardRepository.findOne({
        where: { name: dto.name, shop: { id: dto.shopId } },
      });
      if (duplicate) {
        throw new ConflictException(
          RewardMessages.REWARD_NAME_EXISTS(dto.name),
        );
      }

      const reward = this.rewardRepository.create({
        ...dto,
        shop, 
      });
      const savedReward = await this.rewardRepository.save(reward);

      if (!shop.rewards) shop.rewards = [];
      shop.rewards.push(savedReward);

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        reward: savedReward,
        message: RewardMessages.REWARD_CREATED,
      });
    } catch (err) {
      return handleServiceError(err);
    }
  }

  private async validateRewardConfiguration(
    shop: Shop,
    isUnlimited: boolean,
  ): Promise<void> {
    if (shop.isGuaranteedWin && !isUnlimited) {
      // For guaranteed wins, check if there's already an unlimited reward
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
        relations: [ /*'category'*/ 'shop'],
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
      const activeGameAssignment =
        await this.activeGameAssignmentRepository.findOne({
          where: { shopId, isActive: true },
          relations: ['rewards', 'shop'],
        });

      if (!activeGameAssignment) {
        return {
          success: false,
          statusCode: 404,
          data: {
            reward: null,
            message: 'No active game found for this shop',
          },
        };
      }

      const shop = activeGameAssignment.shop;

      // Check if shop has guaranteed win or percentage-based win
      if (!shop.isGuaranteedWin) {
        const randomValue = Math.random() * 100;
        const winningChance = shop.winningPercentage || 50; // Default 50% win or losing

        console.log(
          `🎲 Random value: ${randomValue}%, Winning chance: ${winningChance}%`,
        );

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

        console.log(`🎉 Player wins! Selecting reward...`);
      }

      // Filter rewards that are available (either unlimited or have quantity > 0)
      const availableRewards = activeGameAssignment.rewards.filter(
        (r) => r.isUnlimited || r.nbRewardTowin > 0,
      );

      if (availableRewards.length === 0) {
        return {
          success: true,
          statusCode: 200,
          data: {
            reward: null,
            message: 'No available rewards at the moment.',
          },
        };
      }

      // Calculate total percentage of available rewards for normalization
      const totalAvailablePercent = availableRewards.reduce(
        (sum, r) => sum + (r.percentage || 0),
        0,
      );

      // Generate random number between 0 and 100
      const randomValue = Math.random() * 100;
      console.log(
        `🔢 Generated random value for reward selection: ${randomValue}`,
      );

      let cumulative = 0;
      let selectedReward: any = null;

      // Loop through available rewards and check cumulative percentages
      for (const reward of availableRewards) {
        // Normalize the percentage based on available rewards only
        const normalizedPercent =
          ((reward.percentage || 0) / totalAvailablePercent) * 100;
        cumulative += normalizedPercent;

        console.log(
          `- ${reward.name}: ${normalizedPercent.toFixed(2)}% chance ` +
            `(Cumulative: ${cumulative.toFixed(2)}%)`,
        );

        // Check if random number falls within this reward's range
        if (randomValue <= cumulative) {
          selectedReward = reward;
          console.log(`🎉 Selected reward: ${reward.name}`);
          break;
        }
      }

      if (!selectedReward) {
        return {
          success: true,
          statusCode: 200,
          data: {
            reward: null,
            message: 'No reward was selected.',
          },
        };
      }

      // Increment winner count for ALL rewards (both limited and unlimited)
      const updatedReward = await this.rewardRepository.findOne({
        where: { id: selectedReward.id },
      });

      if (!updatedReward) {
        throw new Error('Selected reward not found');
      }

      // Initialize winnerCount
      const currentWinnerCount = updatedReward.winnerCount || 0;

      // Decrement quantity if not unlimited
      const updateData: any = { winnerCount: currentWinnerCount + 1 };
      if (!selectedReward.isUnlimited) {
        updateData.nbRewardTowin = selectedReward.nbRewardTowin - 1;
      }

      // Update the reward
      await this.rewardRepository.update({ id: selectedReward.id }, updateData);

      // Get the updated reward with the new winner count
      const finalReward = await this.rewardRepository.findOne({
        where: { id: selectedReward.id },
      });

      if (!finalReward) {
        throw new Error('Updated reward not found after increment');
      }

      console.log(
        `🏆 Winner count incremented for "${finalReward.name}": ${finalReward.winnerCount}`,
      );

      return {
        success: true,
        statusCode: 201,
        data: {
          reward: {
            ...finalReward,
            isActive: finalReward.status === RewardStatus.ACTIVE,
          },
          message: shop.isGuaranteedWin
            ? 'Reward randomly chosen successfully'
            : `Congratulations! You won with ${shop.winningPercentage}% chance!`,
        },
      };
    } catch (error) {
      console.error('Error in selectRandomReward:', error);
      return {
        success: false,
        statusCode: 500,
        data: {
          reward: null,
          message: 'Error selecting reward',
        },
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
