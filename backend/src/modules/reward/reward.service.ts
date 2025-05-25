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
    shopId: string,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id: shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
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
        where: { name: dto.name, shop: { id: shopId } },
      });

      if (existingReward) {
        throw new ConflictException(
          RewardMessages.REWARD_NAME_EXISTS(dto.name),
        );
      }

      const newReward = this.rewardRepository.create({
        ...dto,
        shop: { id: shopId } as Shop,
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
    shopId?: string,
  ): Promise<ApiResponseInterface<Reward[]> | ErrorResponseInterface> {
    try {
      const queryOptions: any = {
        relations: ['category', 'shop'],
        order: { createdAt: 'DESC' },
      };

      if (shopId) {
        queryOptions.where = { shop: { id: shopId } };
      }

      const rewards = await this.rewardRepository.find(queryOptions);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        rewards,
        count: rewards.length,
        message: RewardMessages.REWARDS_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
    shopId?: string,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const queryOptions: any = {
        where: { id, status: RewardStatus.ACTIVE },
        relations: ['category', 'shop'],
      };

      if (shopId) {
        queryOptions.where.shop = { id: shopId };
      }

      const reward = await this.rewardRepository.findOne(queryOptions);

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
    dto: UpdateRewardDto,
    shopId: string,
  ): Promise<ApiResponseInterface<Reward> | ErrorResponseInterface> {
    try {
      const reward = await this.rewardRepository.findOne({
        where: { id, shop: { id: shopId } },
        relations: ['shop'],
      });

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
}
