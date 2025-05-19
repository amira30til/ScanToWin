import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionPermissionDto } from './dto/create-subscription-permission.dto';
import { UpdateSubscriptionPermissionDto } from './dto/update-subscription-permission.dto';
import { SubscriptionPermission } from './entities/subscription-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { SubscriptionPermissionMessages } from 'src/common/constants/messages.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';

@Injectable()
export class SubscriptionPermissionService {
  constructor(
    @InjectRepository(SubscriptionPermission)
    private readonly subscriptionPermissionRepository: Repository<SubscriptionPermission>,
  ) {}

  async create(
    createSubscriptionPermissionDto: CreateSubscriptionPermissionDto,
  ): Promise<
    ApiResponseInterface<SubscriptionPermission> | ErrorResponseInterface
  > {
    try {
      const existingPermission =
        await this.subscriptionPermissionRepository.findOne({
          where: {
            subscriptionPlan: {
              id: createSubscriptionPermissionDto.subscriptionPlanId,
            },
            permission: { id: createSubscriptionPermissionDto.permissionId },
          },
        });

      if (existingPermission) {
        throw new ConflictException(
          SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_ALREADY_EXISTS,
        );
      }

      const subscriptionPermission =
        this.subscriptionPermissionRepository.create(
          createSubscriptionPermissionDto,
        );

      const savedPermission = await this.subscriptionPermissionRepository.save(
        subscriptionPermission,
      );

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        message: SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_CREATED,
        subscriptionPermission: savedPermission,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<SubscriptionPermission[]> | ErrorResponseInterface
  > {
    try {
      const permissions = await this.subscriptionPermissionRepository.find({
        relations: ['subscriptionPlan', 'permission'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        subscriptionPermissions: permissions,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<
    ApiResponseInterface<SubscriptionPermission> | ErrorResponseInterface
  > {
    try {
      const permission = await this.subscriptionPermissionRepository.findOne({
        where: { id },
        relations: ['subscriptionPlan', 'permission'],
      });

      if (!permission) {
        throw new NotFoundException(
          SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_NOT_FOUND(id),
        );
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        subscriptionPermission: permission,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    updateSubscriptionPermissionDto: UpdateSubscriptionPermissionDto,
  ): Promise<
    ApiResponseInterface<SubscriptionPermission> | ErrorResponseInterface
  > {
    try {
      const existingPermission =
        await this.subscriptionPermissionRepository.findOne({
          where: { id },
        });

      if (!existingPermission) {
        throw new NotFoundException(
          SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_NOT_FOUND(id),
        );
      }

      if (
        updateSubscriptionPermissionDto.subscriptionPlanId ||
        updateSubscriptionPermissionDto.permissionId
      ) {
        const planId =
          updateSubscriptionPermissionDto.subscriptionPlanId ||
          existingPermission.subscriptionPlan.id;
        const permissionId =
          updateSubscriptionPermissionDto.permissionId ||
          existingPermission.permission.id;

        const duplicatePermission =
          await this.subscriptionPermissionRepository.findOne({
            where: {
              subscriptionPlan: { id: planId },
              permission: { id: permissionId },
            },
          });

        if (duplicatePermission && duplicatePermission.id !== id) {
          throw new ConflictException(
            SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_ALREADY_EXISTS,
          );
        }
      }

      await this.subscriptionPermissionRepository.update(
        id,
        updateSubscriptionPermissionDto,
      );

      const updatedPermission =
        await this.subscriptionPermissionRepository.findOne({
          where: { id },
          relations: ['subscriptionPlan', 'permission'],
        });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_UPDATED,
        subscriptionPermission: updatedPermission,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<void> | ErrorResponseInterface> {
    try {
      const permission = await this.subscriptionPermissionRepository.findOne({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException(
          SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_NOT_FOUND(id),
        );
      }

      await this.subscriptionPermissionRepository.delete(id);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: SubscriptionPermissionMessages.SUBSCRIPTION_PERMISSION_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
