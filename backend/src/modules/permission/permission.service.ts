import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Permission } from './entities/permession.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionMessages } from 'src/common/constants/messages.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { handleServiceError } from 'src/common/utils/error-handler.util';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<ApiResponseInterface<Permission> | ErrorResponseInterface> {
    try {
      //TODO: SHOULD IT BE UNIQUE ???????????????
      // const existingPermission = await this.permissionRepository.findOne({
      //   where: { key: createPermissionDto.key },
      // });

      // if (existingPermission) {
      //   throw new ConflictException(
      //     PermissionMessages.PERMISSION_ALREADY_EXISTS(createPermissionDto.key),
      //   );
      // }

      const permission = this.permissionRepository.create(createPermissionDto);
      const savedPermission = await this.permissionRepository.save(permission);

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        message: PermissionMessages.PERMISSION_CREATED,
        permission: savedPermission,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<Permission[]> | ErrorResponseInterface
  > {
    try {
      const permissions = await this.permissionRepository.find();
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        permissions,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async findOne(
    id: number,
  ): Promise<ApiResponseInterface<Permission> | ErrorResponseInterface> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException(
          PermissionMessages.PERMISSION_NOT_FOUND(id),
        );
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        permission,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: number,
    updatePermissionDto: CreatePermissionDto,
  ): Promise<ApiResponseInterface<Permission> | ErrorResponseInterface> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException(
          PermissionMessages.PERMISSION_NOT_FOUND(id),
        );
      }

      if (
        updatePermissionDto.key &&
        updatePermissionDto.key !== permission.key
      ) {
        const existingPermission = await this.permissionRepository.findOne({
          where: { key: updatePermissionDto.key },
        });

        if (existingPermission) {
          throw new ConflictException(
            PermissionMessages.PERMISSION_ALREADY_EXISTS(
              updatePermissionDto.key,
            ),
          );
        }
      }

      await this.permissionRepository.update(id, updatePermissionDto);
      const updatedPermission = await this.permissionRepository.findOne({
        where: { id },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: PermissionMessages.PERMISSION_UPDATED,
        permission: updatedPermission,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: number,
  ): Promise<ApiResponseInterface<void> | ErrorResponseInterface> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException(
          PermissionMessages.PERMISSION_NOT_FOUND(id),
        );
      }

      await this.permissionRepository.delete(id);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: PermissionMessages.PERMISSION_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
