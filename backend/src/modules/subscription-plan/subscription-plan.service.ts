import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlanMessages } from 'src/common/constants/messages.constants';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { ApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) {}

  async create(
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<ApiResponseInterface<SubscriptionPlan> | ErrorResponseInterface> {
    try {
      // Check if plan with same name already exists
      const existingPlan = await this.subscriptionPlanRepository.findOne({
        where: { name: createSubscriptionPlanDto.name },
      });

      if (existingPlan) {
        throw new ConflictException(
          SubscriptionPlanMessages.SUB_PLAN_ALREADY_EXISTS(
            createSubscriptionPlanDto.name,
          ),
        );
      }

      const subscriptionPlan = this.subscriptionPlanRepository.create(
        createSubscriptionPlanDto,
      );
      const savedPlan =
        await this.subscriptionPlanRepository.save(subscriptionPlan);

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        message: SubscriptionPlanMessages.SUB_PLAN_CREATED,
        subscriptionPlan: savedPlan,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<SubscriptionPlan[]> | ErrorResponseInterface
  > {
    try {
      const plans = await this.subscriptionPlanRepository.find({
        relations: [
          'subscriptionPermissions',
          'subscriptionPermissions.permission',
        ],
        order: {
          id: 'ASC',
        },
      });
      plans.forEach((plan) => {
        plan.subscriptionPermissions.sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
        );
      });
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        subscriptionPlans: plans,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<SubscriptionPlan> | ErrorResponseInterface> {
    try {
      const plan = await this.subscriptionPlanRepository.findOne({
        where: { id },
      });

      if (!plan) {
        throw new NotFoundException(
          SubscriptionPlanMessages.SUB_PLAN_NOT_FOUND(id),
        );
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        subscriptionPlan: plan,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<ApiResponseInterface<SubscriptionPlan> | ErrorResponseInterface> {
    try {
      const existingPlan = await this.subscriptionPlanRepository.findOne({
        where: { id },
      });

      if (!existingPlan) {
        throw new NotFoundException(
          SubscriptionPlanMessages.SUB_PLAN_NOT_FOUND(id),
        );
      }

      // Check if new name conflicts with existing plans
      if (
        updateSubscriptionPlanDto.name &&
        updateSubscriptionPlanDto.name !== existingPlan.name
      ) {
        const nameExists = await this.subscriptionPlanRepository.findOne({
          where: { name: updateSubscriptionPlanDto.name },
        });

        if (nameExists) {
          throw new ConflictException(
            SubscriptionPlanMessages.SUB_PLAN_ALREADY_EXISTS(
              updateSubscriptionPlanDto.name,
            ),
          );
        }
      }

      await this.subscriptionPlanRepository.update(
        id,
        updateSubscriptionPlanDto,
      );
      const updatedPlan = await this.subscriptionPlanRepository.findOne({
        where: { id },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: SubscriptionPlanMessages.SUB_PLAN_UPDATED,
        subscriptionPlan: updatedPlan,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<void> | ErrorResponseInterface> {
    try {
      const plan = await this.subscriptionPlanRepository.findOne({
        where: { id },
      });

      if (!plan) {
        throw new NotFoundException(
          SubscriptionPlanMessages.SUB_PLAN_NOT_FOUND(id),
        );
      }

      await this.subscriptionPlanRepository.delete(id);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: SubscriptionPlanMessages.SUB_PLAN_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
