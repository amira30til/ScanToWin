import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ChosenActionService } from './chosen-action.service';
import { UpsertChosenActionsDto } from './dto/create-chosen-action.dto';
import { UpdateChosenActionDto } from './dto/update-chosen-action.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ChosenAction } from './entities/chosen-action.entity';
import { ChosenActionMessages } from 'src/common/constants/messages.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';

@Controller('chosen-action')
export class ChosenActionController {
  constructor(private readonly chosenActionService: ChosenActionService) {}

  @Patch('/shop/:shopId/sync')
  @ApiOperation({
    summary: 'Create / update / delete chosen actions in bulk',
    description:
      'Receives an array of chosen actions and performs upsert logic: create if no id, update if id exists, delete if disappeared.',
  })
  @ApiBody({ type: UpsertChosenActionsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Chosen actions processed successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Duplicate chosen action for this shop',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  async upsertChosenActions(@Body() dto: UpsertChosenActionsDto) {
    return this.chosenActionService.syncChosenActions(
      dto.shopId,
      dto.chosenActions,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Get all chosen actions' })
  @ApiResponse({
    status: 200,
    type: [ChosenAction],
    description: ChosenActionMessages.ALL_RETRIEVED,
  })
  async findAll() {
    return this.chosenActionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chosen action by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: ChosenAction,
    description: ChosenActionMessages.RETRIEVED,
  })
  @ApiResponse({ status: 404, description: 'Chosen action not found' })
  async findOne(@Param('id') id: string) {
    return this.chosenActionService.findOne(id);
  }

  @Get('/shop/:shopId')
  @ApiOperation({ summary: 'Get all chosen actions by shop ID' })
  @ApiParam({ name: 'shopId', type: String })
  @ApiResponse({
    status: 200,
    type: [ChosenAction],
    description: 'Chosen actions retrieved for a shop',
  })
  async findByShopId(@Param('shopId') shopId: string) {
    return this.chosenActionService.findByShopId(shopId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a chosen action by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: ChosenAction,
    description: ChosenActionMessages.UPDATED,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateChosenActionDto) {
    return this.chosenActionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chosen action by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: ChosenActionMessages.DELETED })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.chosenActionService.remove(id);
  }
  @Post('clicked-action')
  @ApiOperation({ summary: 'Tracking clicked actions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clicked Action ++',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Chosen Action not found',
  })
  @ApiQuery({
    name: 'chosenActionId',
    required: true,
    description: 'Chosen Action ID',
    type: String,
  })
  async trackActions(
    @Query('chosenActionId') chosenActionId: string,
  ): Promise<ApiResponseInterface<ChosenAction> | ErrorResponseInterface> {
    return this.chosenActionService.trackActions(chosenActionId);
  }
}
