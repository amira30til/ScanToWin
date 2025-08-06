import { Controller, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ActionClickService } from './action-click.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ActionClick } from './entities/action-click.entity';
import { AdminGuard } from '../auth/guards/admins.guard';
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('action-click')
export class ActionClickController {
  constructor(private readonly actionClickService: ActionClickService) {}

  @Get('shop/:shopId')
  @ApiOperation({ summary: 'Get all action clicks by shop ID' })
  @ApiParam({ name: 'shopId', type: 'string', description: 'Shop UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of clicks for the given shop',
    type: [ActionClick],
  })
  findByShop(@Param('shopId') shopId: string) {
    return this.actionClickService.findAllByShopId(shopId);
  }

  @Get('chosen-action/:chosenActionId')
  @ApiOperation({ summary: 'Get all action clicks by chosen action ID' })
  @ApiParam({
    name: 'chosenActionId',
    type: 'string',
    description: 'Chosen action UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of clicks for the given chosen action',
    type: [ActionClick],
  })
  findByAction(@Param('chosenActionId') chosenActionId: string) {
    return this.actionClickService.findAllByChosenActionId(chosenActionId);
  }
}
