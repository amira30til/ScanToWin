import {
  ConflictException,
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
import { Repository } from 'typeorm';
import { RewardCategory } from '../reward-category/entities/reward-category.entity';
import { Shop } from '../shops/entities/shop.entity';
import { Reward } from './entities/reward.entity';
import { RewardStatus } from './enums/reward-status.enums';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(RewardCategory)
    private readonly rewardCategoryRepository: Repository<RewardCategory>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async create(
    dto: CreateRewardDto,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id: dto.shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(dto.shopId));
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

      const existingReward = await this.rewardRepository.findOne({
        where: { name: dto.name, shop: { id: dto.shopId } },
      });

      if (existingReward) {
        throw new ConflictException(
          RewardMessages.REWARD_NAME_EXISTS(dto.name),
        );
      }

      const newReward = this.rewardRepository.create({
        ...dto,
      });

      const savedReward = await this.rewardRepository.save(newReward);

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        reward: savedReward,
        message: RewardMessages.REWARD_CREATED,
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

  async update(
    id: string,
    shopId: string,
    dto: UpdateRewardDto,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: { id, shop: { id: shopId } },
        relations: ['shop'],
      });

      console.log('reward', reward);

      if (!reward) {
        throw new NotFoundException(
          `Reward with ID '${id}' not found for this shop`,
        );
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
}
