import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionClickDto } from './dto/create-action-click.dto';
import { UpdateActionClickDto } from './dto/update-action-click.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionClick } from './entities/action-click.entity';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  ActionClickMessages,
  ChosenActionMessages,
  ShopMessages,
} from 'src/common/constants/messages.constants';
import { Shop } from '../shops/entities/shop.entity';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';

@Injectable()
export class ActionClickService {
  constructor(
    @InjectRepository(ActionClick)
    private readonly actionClickRepository: Repository<ActionClick>,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    @InjectRepository(ChosenAction)
    private readonly chosenActionRepository: Repository<ChosenAction>,
  ) {}
  async findAllByShopId(
    shopId: string,
  ): Promise<ApiResponseInterface<ActionClick[]> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }
      const clicks = await this.actionClickRepository.find({
        where: {
          shop: { id: shopId },
        },
        order: { clickedAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: clicks,
        message: clicks.length
          ? ActionClickMessages.FOUND_BY_SHOP(shopId)
          : ActionClickMessages.NO_CLICKS_FOR_SHOP(shopId),
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAllByChosenActionId(
    chosenActionId: string,
  ): Promise<ApiResponseInterface<ActionClick[]> | ErrorResponseInterface> {
    try {
      const chosenAction = await this.chosenActionRepository.findOne({
        where: { id: chosenActionId },
      });

      if (!chosenAction) {
        throw new NotFoundException(
          ChosenActionMessages.NOT_FOUND(chosenActionId),
        );
      }
      const clicks = await this.actionClickRepository.find({
        where: {
          chosenAction: { id: chosenActionId },
        },
        order: { clickedAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: clicks,
        message: clicks.length
          ? ActionClickMessages.FOUND_BY_ACTION(chosenActionId)
          : ActionClickMessages.NO_CLICKS_FOR_ACTION(chosenActionId),
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  findAll() {
    return `This action returns all actionClick`;
  }

  findOne(id: number) {
    return `This action returns a #${id} actionClick`;
  }

  update(id: number, updateActionClickDto: UpdateActionClickDto) {
    return `This action updates a #${id} actionClick`;
  }

  remove(id: number) {
    return `This action removes a #${id} actionClick`;
  }
}
