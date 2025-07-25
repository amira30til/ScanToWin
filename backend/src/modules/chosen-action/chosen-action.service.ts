import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrUpdateChosenActionItemDto } from './dto/create-chosen-action.dto';
import { UpdateChosenActionDto } from './dto/update-chosen-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChosenAction } from './entities/chosen-action.entity';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ApiResponse } from 'src/common/utils/response.util';
import {
  ChosenActionMessages,
  ShopMessages,
} from 'src/common/constants/messages.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { Action } from '../actions/entities/action.entity';
import { ActionClick } from '../action-click/entities/action-click.entity';
import { Shop } from '../shops/entities/shop.entity';

@Injectable()
export class ChosenActionService {
  constructor(
    @InjectRepository(ChosenAction)
    private readonly chosenActionRepository: Repository<ChosenAction>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(ActionClick)
    private readonly actionClickRepository: Repository<ActionClick>,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}
  async syncChosenActions(
    shopId: string,
    receivedActions: CreateOrUpdateChosenActionItemDto[],
  ): Promise<ApiResponseInterface<any> | ErrorResponseInterface> {
    try {
      const existingActions = await this.chosenActionRepository.find({
        where: { shopId },
      });

      const receivedIds = receivedActions.filter((a) => a.id).map((a) => a.id);

      const toDelete = existingActions.filter(
        (dbItem) => !receivedIds.includes(dbItem.id),
      );
     

      if (toDelete.length > 0) {
        await this.chosenActionRepository.remove(toDelete);
      }

      const results: ChosenAction[] = [];

      for (const actionDto of receivedActions) {
        const action = await this.actionRepository.findOne({
          where: { id: actionDto.actionId, isActive: true },
        });

        if (!action) {
          throw new NotFoundException(
            `Action with ID ${actionDto.actionId} is not active or does not exist`,
          );
        }

        if (!actionDto.id) {
          const newChosen = this.chosenActionRepository.create({
            ...actionDto,
            shopId,
          });
          const saved = await this.chosenActionRepository.save(newChosen);
          results.push(saved);
        } else {
          const existing = await this.chosenActionRepository.findOne({
            where: { id: actionDto.id, shopId },
          });

          if (!existing) continue;

          const hasChanges =
            existing.name !== actionDto.name ||
            existing.position !== actionDto.position ||
            existing.targetLink !== actionDto.targetLink ||
            existing.actionId !== actionDto.actionId;

          if (hasChanges) {
            const updated = this.chosenActionRepository.merge(
              existing,
              actionDto,
            );
            const saved = await this.chosenActionRepository.save(updated);
            results.push(saved);
          } else {
            results.push(existing);
          }
        }
      }

      return ApiResponse.success(200, {
        chosenActions: results,
        message: `Chosen actions synced for shop ${shopId}`,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<ChosenAction[]> | ErrorResponseInterface
  > {
    try {
      const actions = await this.chosenActionRepository.find();
      return ApiResponse.success(200, {
        chosenActions: actions,
        message: ChosenActionMessages.ALL_RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<ChosenAction> | ErrorResponseInterface> {
    try {
      const action = await this.chosenActionRepository.findOne({
        where: { id },
      });
      if (!action)
        throw new NotFoundException(ChosenActionMessages.NOT_FOUND(id));

      return ApiResponse.success(200, {
        chosenAction: action,
        message: ChosenActionMessages.RETRIEVED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByShopId(
    shopId: string,
  ): Promise<ApiResponseInterface<ChosenAction[]> | ErrorResponseInterface> {
    try {
      const actions = await this.chosenActionRepository.find({
        where: { shopId },
      });

      return ApiResponse.success(200, {
        chosenActions: actions,
        message: ChosenActionMessages.BY_SHOP_RETRIEVED(shopId),
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    dto: UpdateChosenActionDto,
  ): Promise<ApiResponseInterface<ChosenAction> | ErrorResponseInterface> {
    try {
      const action = await this.chosenActionRepository.findOne({
        where: { id },
      });
      if (!action)
        throw new NotFoundException(ChosenActionMessages.NOT_FOUND(id));

      const updated = this.chosenActionRepository.merge(action, dto);
      const saved = await this.chosenActionRepository.save(updated);

      return ApiResponse.success(200, {
        chosenAction: saved,
        message: ChosenActionMessages.UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<{ id: string }> | ErrorResponseInterface> {
    try {
      const action = await this.chosenActionRepository.findOne({
        where: { id },
      });
      if (!action)
        throw new NotFoundException(ChosenActionMessages.NOT_FOUND(id));

      await this.chosenActionRepository.remove(action);

      return ApiResponse.success(200, {
        id,
        message: ChosenActionMessages.DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async trackActions(
    chosenActionId: string,
  ): Promise<ApiResponseInterface<ChosenAction> | ErrorResponseInterface> {
    try {
      const chosenAction = await this.chosenActionRepository.findOne({
        where: { id: chosenActionId },
      });

      if (!chosenAction) {
        throw new NotFoundException(
          ChosenActionMessages.NOT_FOUND(chosenActionId),
        );
      }

      const shop = await this.shopsRepository.findOne({
        where: { id: chosenAction.shopId },
      });

      if (!shop) {
        throw new NotFoundException(
          ShopMessages.SHOP_NOT_FOUND(chosenAction.shopId),
        );
      }
      const click = this.actionClickRepository.create({
        chosenAction,
        shop,
      });
      await this.actionClickRepository.save(click);
      return ApiResponse.success(HttpStatus.OK, {
        message: ChosenActionMessages.INCREMENTED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
