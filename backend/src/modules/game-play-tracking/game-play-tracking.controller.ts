import { Controller, Get, Param } from '@nestjs/common';
import { GamePlayTrackingService } from './game-play-tracking.service';

import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { GamePlayTracking } from './entities/game-play-tracking.entity';

@Controller('game-play-tracking')
export class GamePlayTrackingController {
  constructor(
    private readonly gamePlayTrackingService: GamePlayTrackingService,
  ) {}

  @Get('by-shop/:shopId')
  @ApiOperation({
    summary: 'Get gameplay tracking logs by shop ID',
    description:
      'Retrieves a list of gameplay logs associated with a specific shop.',
  })
  @ApiParam({
    name: 'shopId',
    type: String,
    description: 'UUID of the shop',
    required: true,
    example: 'b9e5c676-b153-4b84-a41a-b27443f0cd7b',
  })
  @ApiResponse({
    status: 200,
    description: 'Gameplay logs fetched successfully',
    type: [GamePlayTracking],
  })
  @ApiResponse({
    status: 404,
    description: 'Shop not found',
  })
  async findAllByShopId(
    @Param('shopId') shopId: string,
  ): Promise<
    ApiResponseInterface<GamePlayTracking[]> | ErrorResponseInterface
  > {
    return this.gamePlayTrackingService.findAllByShopId(shopId);
  }

  @Get('by-chosen-action/:chosenActionId')
  @ApiOperation({
    summary: 'Get gameplay tracking logs by chosen action ID',
    description:
      'Retrieves gameplay tracking entries linked to a specific chosen action.',
  })
  @ApiParam({
    name: 'chosenActionId',
    type: String,
    description: 'UUID of the chosen action',
    required: true,
    example: 'd8720a24-e379-42f6-9403-fdb81e914df4',
  })
  @ApiResponse({
    status: 200,
    description: 'Gameplay logs fetched successfully',
    type: [GamePlayTracking],
  })
  @ApiResponse({
    status: 404,
    description: 'Chosen action not found',
  })
  async findAllByChosenActionId(
    @Param('chosenActionId') chosenActionId: string,
  ): Promise<
    ApiResponseInterface<GamePlayTracking[]> | ErrorResponseInterface
  > {
    return this.gamePlayTrackingService.findAllByChosenActionId(chosenActionId);
  }
}
