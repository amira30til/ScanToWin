import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ActionMessages } from 'src/common/constants/messages.constants';
import { Action } from './entities/action.entity';
import { ErrorResponseInterface } from 'src/common/interfaces/response.interface';
import { AdminGuard } from '../auth/guards/admins.guard';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new action' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ActionMessages.ACTION_CREATED,
    type: Action,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Action with this name already exists',
  })
  async create(@Body() createActionDto: CreateActionDto) {
    console.log('yyyy', createActionDto);

    return this.actionsService.create(createActionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all actions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ActionMessages.ACTIONS_RETRIEVED,
    type: [Action],
  })
  async findAll() {
    return this.actionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get action by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ActionMessages.ACTION_RETRIEVED,
    type: Action,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Action not found',
  })
  async findOne(@Param('id') id: string) {
    return this.actionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an action by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ActionMessages.ACTION_UPDATED,
    type: Action,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Action not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
  ) {
    return this.actionsService.update(id, updateActionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an action by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ActionMessages.ACTION_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Action not found',
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.actionsService.remove(id);
  }
  @Delete('soft-delete/:actionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Soft delete an action',
    description:
      'Marks an action as inactive (isActive = false) instead of permanently deleting it.',
  })
  @ApiParam({
    name: 'actionId',
    type: String,
    required: true,
    description: 'UUID of the action to be soft deleted',
  })
  @ApiResponse({
    status: 200,
    description: 'Action soft deleted successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          id: 'uuid',
          message: 'Action soft deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Action not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Action already inactive',
  })
  async softDeleteAction(
    @Param('actionId') actionId: string,
  ): Promise<any | ErrorResponseInterface> {
    return this.actionsService.softDeleteAction(actionId);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active actions',
    description:
      'Returns all actions that are currently active (isActive = true).',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active actions',
  })
  async getActiveActions(): Promise<any> {
    return this.actionsService.findByStatus(true);
  }
}
