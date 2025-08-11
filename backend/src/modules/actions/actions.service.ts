import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ActionMessages } from 'src/common/constants/messages.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { handleServiceError } from 'src/common/utils/error-handler.util';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}
  async create(
    dto: CreateActionDto,
  ): Promise<ApiResponseInterface<Action> | ErrorResponseInterface> {
    try {
      const existing = await this.actionRepository.findOne({
        where: { name: dto.name },
      });

      if (existing) {
        throw new ConflictException(
          ActionMessages.ACTION_NAME_EXISTS(dto.name),
        );
      }

      const newAction = this.actionRepository.create(dto);
      const saved = await this.actionRepository.save(newAction);

      return ApiResponse.success(201, {
        action: saved,
        message: ActionMessages.ACTION_CREATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<Action[]> | ErrorResponseInterface
  > {
    try {
      const actions = await this.actionRepository.find();
      return ApiResponse.success(200, {
        actions,
        message: ActionMessages.ACTIONS_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<Action> | ErrorResponseInterface> {
    try {
      const action = await this.actionRepository.findOne({ where: { id } });
      if (!action) {
        throw new NotFoundException(ActionMessages.ACTION_NOT_FOUND(id));
      }

      return ApiResponse.success(200, {
        action,
        message: ActionMessages.ACTION_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    dto: UpdateActionDto,
  ): Promise<ApiResponseInterface<Action> | ErrorResponseInterface> {
    try {
      const action = await this.actionRepository.findOne({ where: { id } });

      if (!action) {
        throw new NotFoundException(ActionMessages.ACTION_NOT_FOUND(id));
      }

      const updated = this.actionRepository.merge(action, dto);
      const saved = await this.actionRepository.save(updated);

      return ApiResponse.success(200, {
        action: saved,
        message: ActionMessages.ACTION_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<{ id: string }> | ErrorResponseInterface> {
    try {
      const action = await this.actionRepository.findOne({ where: { id } });

      if (!action || !id) {
        throw new NotFoundException(ActionMessages.ACTION_NOT_FOUND(id));
      }

      await this.actionRepository.delete(id);

      return ApiResponse.success(200, {
        id,
        message: ActionMessages.ACTION_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async softDeleteAction(
    actionId: string,
  ): Promise<ApiResponseInterface<{ id: string }> | ErrorResponseInterface> {
    try {
      const action = await this.actionRepository.findOne({
        where: { id: actionId },
      });

      if (!action) {
        throw new NotFoundException(ActionMessages.ACTION_NOT_FOUND(actionId));
      }

      if (!action.isActive) {
        throw new ConflictException('Action is already inactive.');
      }

      await this.actionRepository.update(actionId, { isActive: false });

      return ApiResponse.success(200, {
        id: actionId,
        message: ActionMessages.ACTION_SOFT_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByStatus(
    isActive: boolean = true,
  ): Promise<ApiResponseInterface<Action[]> | ErrorResponseInterface> {
    try {
      const actions = await this.actionRepository.find({
        where: { isActive },
      });

      return ApiResponse.success(200, {
        actions,
        message: ActionMessages.ACTIONS_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
