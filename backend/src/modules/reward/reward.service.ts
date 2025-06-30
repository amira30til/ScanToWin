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
      // Load shop with active game assignments
      const shop = await this.shopRepository.findOne({
        where: { id: dto.shopId },
        relations: ['activeGameAssignments'],
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(dto.shopId));
      }

      // Validate reward configuration based on shop's guaranteed win setting
      await this.validateRewardConfiguration(shop, dto.isUnlimited ?? false);

      // Optional: Validate category existence
      if (dto.categoryId) {
        const category = await this.rewardCategoryRepository.findOne({
          where: { id: dto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            RewardMessages.CATEGORY_NOT_FOUND(dto.categoryId),
          );
        }
      }

      // Check for reward name duplication
      const existingReward = await this.rewardRepository.findOne({
        where: { name: dto.name, shop: { id: dto.shopId } },
      });
      if (existingReward) {
        throw new ConflictException(
          RewardMessages.REWARD_NAME_EXISTS(dto.name),
        );
      }

      // Create and save reward
      const newReward = this.rewardRepository.create({ ...dto });
      const savedReward = await this.rewardRepository.save(newReward);

      // Attach reward to the shop's active game assignment if it exists
      if (shop.activeGameAssignments && shop.activeGameAssignments.length > 0) {
        // Load the active assignment with its rewards relation
        const activeAssignment =
          await this.activeGameAssignmentRepository.findOne({
            where: { id: shop.activeGameAssignments[0].id },
            relations: ['rewards'],
          });

        if (activeAssignment) {
          // Initialize rewards array if it's undefined
          if (!activeAssignment.rewards) {
            activeAssignment.rewards = [];
          }

          activeAssignment.rewards.push(savedReward);
          await this.activeGameAssignmentRepository.save(activeAssignment);
        }
      }

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        reward: savedReward,
        message: RewardMessages.REWARD_CREATED,
      });
    } catch (error) {
      return handleServiceError(error);
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

      if (dto.categoryId) {
        const category = await this.rewardCategoryRepository.findOne({
          where: { id: dto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            RewardMessages.CATEGORY_NOT_FOUND(dto.categoryId),
          );
        }
      }

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
        relations: ['category', 'shop'],
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
        relations: ['category', 'shop'],
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
      relations: ['category', 'shop'],
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
        relations: ['category', 'shop'],
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
        relations: ['category', 'shop'],
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
  async selectRandomReward(
    shopId: string,
    totalPlayers: number = 1000,
  ): Promise<{
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

      // Get all rewards and calculate their probabilities based on initial counts
      const rewardProbabilities = this.calculateRewardProbabilities(
        activeGameAssignment.rewards,
        totalPlayers,
      );

      // debg
      console.log('📊 Initial reward probabilities:');
      rewardProbabilities.forEach((rp) => {
        console.log(
          `- ${rp.reward.name}: ${(rp.probability * 100).toFixed(2)}% chance ` +
            `(Range: ${rp.probabilityRange.min.toFixed(4)}-${rp.probabilityRange.max.toFixed(4)})`,
        );
      });

      const randomValue = Math.random();
      console.log(
        `🔢 Generated random value for reward selection: ${randomValue}`,
      );

      const selectedRewardProb = this.selectRewardFromProbabilities(
        rewardProbabilities,
        randomValue,
      );

      if (!selectedRewardProb) {
        return {
          success: true,
          statusCode: 200,
          data: {
            reward: null,
            message: 'No reward won this time',
          },
        };
      }

      // Increment winner count for ALL rewards (both limited and unlimited)
      const updatedReward = await this.rewardRepository.findOne({
        where: { id: selectedRewardProb.reward.id },
      });

      if (!updatedReward) {
        throw new Error('Selected reward not found');
      }

      // Initialize winnerCount
      const currentWinnerCount = updatedReward.winnerCount || 0;

      // Increment the winner count
      await this.rewardRepository.update(
        { id: selectedRewardProb.reward.id },
        { winnerCount: currentWinnerCount + 1 },
      );

      // Get the updated reward with the new winner count
      const finalReward = await this.rewardRepository.findOne({
        where: { id: selectedRewardProb.reward.id },
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

  private calculateRewardProbabilities(
    rewards: Reward[],
    totalPlayers: number,
  ): RewardProbability[] {
    const rewardProbabilities: RewardProbability[] = [];
    let cumulativeProbability = 0;

    // Calculate total limited rewards
    const limitedRewards = rewards.filter((r) => !r.isUnlimited);
    const totalLimitedRewards = limitedRewards.reduce(
      (sum, reward) => sum + reward.nbRewardTowin,
      0,
    );

    console.log(
      `🔢 Total limited rewards initially available: ${totalLimitedRewards}`,
    );

    for (const reward of rewards) {
      let probability: number;
      let remainingCount: number;

      if (reward.isUnlimited) {
        // For unlimited rewards: (totalPlayers - totalLimitedRewards) / totalPlayers
        remainingCount = totalPlayers - totalLimitedRewards;
        probability = remainingCount / totalPlayers;
        console.log(
          `♾️  Unlimited reward "${reward.name}": calculated virtual count = ${remainingCount} (${(probability * 100).toFixed(2)}% chance)`,
        );
      } else {
        // For limited rewards: nbRewardTowin / totalPlayers (using initial count)
        remainingCount = reward.nbRewardTowin;
        probability = remainingCount / totalPlayers;
        console.log(
          `🎯 Limited reward "${reward.name}": ${remainingCount} initially available (${(probability * 100).toFixed(2)}% chance)`,
        );
      }

      const probabilityRange = {
        min: cumulativeProbability,
        max: cumulativeProbability + probability,
      };

      rewardProbabilities.push({
        reward,
        probability,
        remainingCount,
        probabilityRange,
      });

      cumulativeProbability += probability;
    }

    // Verify total probability is 1 (100%)
    console.log(`✅ Total probability: ${cumulativeProbability}`);

    return rewardProbabilities;
  }

  private selectRewardFromProbabilities(
    rewardProbabilities: RewardProbability[],
    randomValue: number,
  ): RewardProbability | null {
    console.log(`🔍 Selecting reward for random value: ${randomValue}`);

    for (const rewardProb of rewardProbabilities) {
      console.log(
        `- Checking ${rewardProb.reward.name} (range: ${rewardProb.probabilityRange.min.toFixed(4)}-${rewardProb.probabilityRange.max.toFixed(4)})`,
      );

      if (
        randomValue >= rewardProb.probabilityRange.min &&
        randomValue < rewardProb.probabilityRange.max
      ) {
        console.log(`🎉 Selected reward: ${rewardProb.reward.name}`);
        return rewardProb;
      }
    }

    console.log(
      '⚠️ No reward selected - this should not happen if probabilities are correct',
    );
    return null;
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
