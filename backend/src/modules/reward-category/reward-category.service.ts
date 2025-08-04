import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRewardCategoryDto } from './dto/create-reward-category.dto';
import { UpdateRewardCategoryDto } from './dto/update-reward-category.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RewardCategory } from './entities/reward-category.entity';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  GameMessages,
  RewardMessages,
} from 'src/common/constants/messages.constants';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ApiResponse } from 'src/common/utils/response.util';
@Injectable()
export class RewardCategoryService {
  constructor(
    @InjectRepository(RewardCategory)
    private readonly rewardCategoryRepository: Repository<RewardCategory>,
  ) {}

  async create(
    dto: CreateRewardCategoryDto,
  ): Promise<ApiResponseInterface<RewardCategory> | ErrorResponseInterface> {
    try {
      const existingCategory = await this.rewardCategoryRepository.findOne({
        where: { name: dto.name },
      });

      if (existingCategory) {
        throw new ConflictException(
          RewardMessages.CATEGORY_NAME_EXISTS(dto.name),
        );
      }

      const newCategory = this.rewardCategoryRepository.create(dto);
      const savedCategory =
        await this.rewardCategoryRepository.save(newCategory);

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        category: savedCategory,
        message: RewardMessages.CATEGORY_CREATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<RewardCategory[]> | ErrorResponseInterface
  > {
    try {
      const categories = await this.rewardCategoryRepository.find({
        //relations: ['rewards'],
        order: { createdAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        categories,
        count: categories.length,
        message: RewardMessages.CATEGORIES_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<RewardCategory> | ErrorResponseInterface> {
    try {
      const category = await this.rewardCategoryRepository.findOne({
        where: { id },
        //relations: ['rewards'],
      });

      if (!category) {
        throw new NotFoundException(RewardMessages.CATEGORY_NOT_FOUND(id));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        category,
        message: RewardMessages.CATEGORY_RETRIEVED, //even msg category not categories i payed attention for it
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    dto: UpdateRewardCategoryDto,
  ): Promise<ApiResponseInterface<RewardCategory> | ErrorResponseInterface> {
    try {
      const category = await this.rewardCategoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(RewardMessages.CATEGORY_NOT_FOUND(id));
      }

      if (dto.name && dto.name !== category.name) {
        const existingCategory = await this.rewardCategoryRepository.findOne({
          where: { name: dto.name },
        });

        if (existingCategory) {
          throw new ConflictException(
            RewardMessages.CATEGORY_NAME_EXISTS(dto.name),
          );
        }
      }

      await this.rewardCategoryRepository.update(id, dto);
      const updatedCategory = await this.rewardCategoryRepository.findOne({
        where: { id },
        //relations: ['rewards'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        category: updatedCategory,
        message: RewardMessages.CATEGORY_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  //also in the case of deleting something , in enums i always add archivied status so instead of deleting we just change the staus more secure and for better tracking cause data important (haja wahida ala toslo7 3alamhali mohamed so to be discussced )
  async remove(
    id: string,
  ): Promise<ApiResponseInterface<null> | ErrorResponseInterface> {
    try {
      const category = await this.rewardCategoryRepository.findOne({
        where: { id },
        //relations: ['rewards'],
      });

      if (!category) {
        throw new NotFoundException(RewardMessages.CATEGORY_NOT_FOUND(id));
      }
      //Bon here i handle it in the entity in case they want to delete the category and if it has rewards it will only add null to the categoryId filed but will throw this msg for better use
      // if (category.rewards && category.rewards.length > 0) {
      //   throw new ConflictException(RewardMessages.CATEGORY_HAS_REWARDS);
      // }

      await this.rewardCategoryRepository.delete(id);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: null,
        message: RewardMessages.CATEGORY_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
