import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGamePlayTrackingDto } from './dto/create-game-play-tracking.dto';
import { UpdateGamePlayTrackingDto } from './dto/update-game-play-tracking.dto';
import { GamePlayTracking } from './entities/game-play-tracking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import {
  ChosenActionMessages,
  ShopMessages,
} from 'src/common/constants/messages.constants';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';
import { Shop } from '../shops/entities/shop.entity';

@Injectable()
export class GamePlayTrackingService {
  constructor(
    @InjectRepository(GamePlayTracking)
    private readonly gamePlayTrackingRepository: Repository<GamePlayTracking>,
    @InjectRepository(ChosenAction)
    private readonly chosenActionRepository: Repository<ChosenAction>,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}

  async findAllByChosenActionId(
    chosenActionId: string,
  ): Promise<
    ApiResponseInterface<GamePlayTracking[]> | ErrorResponseInterface
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

      const logs = await this.gamePlayTrackingRepository.find({
        where: { chosenAction: { id: chosenActionId } },
        order: { playedAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: logs,
        message: logs.length
          ? `Found ${logs.length} game plays for chosen action ${chosenActionId}`
          : `No game plays found for chosen action ${chosenActionId}`,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async findAllByShopId(
    shopId: string,
  ): Promise<
    ApiResponseInterface<GamePlayTracking[]> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }

      const gamePlayLogs = await this.gamePlayTrackingRepository.find({
        where: {
          shop: { id: shopId },
        },

        order: { playedAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: gamePlayLogs,
        message: gamePlayLogs.length
          ? `Found ${gamePlayLogs.length} gameplay logs for shop ${shopId}`
          : `No gameplay logs found for shop ${shopId}`,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  create(createGamePlayTrackingDto: CreateGamePlayTrackingDto) {
    return 'This action adds a new gamePlayTracking';
  }

  findAll() {
    return `This action returns all gamePlayTracking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gamePlayTracking`;
  }

  update(id: number, updateGamePlayTrackingDto: UpdateGamePlayTrackingDto) {
    return `This action updates a #${id} gamePlayTracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} gamePlayTracking`;
  }
}
