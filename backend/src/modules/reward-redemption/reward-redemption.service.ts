import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRewardRedemptionDto } from './dto/update-reward-redemption.dto';
import { RewardRedemption } from './entities/reward-redemption.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import {
  ChosenActionMessages,
  RewardRedemptionMessages,
  ShopMessages,
} from 'src/common/constants/messages.constants';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { ApiResponse } from 'src/common/utils/response.util';
import { Shop } from '../shops/entities/shop.entity';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';

@Injectable()
export class RewardRedemptionService {
  constructor(
    @InjectRepository(RewardRedemption)
    private rewardRedemptionRepository: Repository<RewardRedemption>,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    @InjectRepository(ChosenAction)
    private readonly chosenActionRepository: Repository<ChosenAction>,
  ) {}
  async findAllByShopId(
    shopId: string,
  ): Promise<
    ApiResponseInterface<RewardRedemption[]> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }
      const redemptions = await this.rewardRedemptionRepository.find({
        where: {
          shop: { id: shopId },
        },
        order: { redeemedAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: redemptions,
        message: redemptions.length
          ? RewardRedemptionMessages.FOUND_BY_SHOP(shopId)
          : RewardRedemptionMessages.NO_REDEMPTIONS_FOR_SHOP(shopId),
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAllByChosenActionId(
    chosenActionId: string,
  ): Promise<
    ApiResponseInterface<RewardRedemption[]> | ErrorResponseInterface
  > {
    try {
      const chosenAction = await this.chosenActionRepository.findOne({
        where: { id: chosenActionId },
      });

      if (!chosenAction) {
        throw new NotFoundException(
          ChosenActionMessages.NOT_FOUND(chosenActionId),
        );
      }
      const redemptions = await this.rewardRedemptionRepository.find({
        where: {
          chosenAction: { id: chosenActionId },
        },
        order: { redeemedAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: redemptions,
        message: redemptions.length
          ? RewardRedemptionMessages.FOUND_BY_CHOSEN_ACTION(chosenActionId)
          : RewardRedemptionMessages.NO_REDEMPTIONS_FOR_ACTION(chosenActionId),
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
