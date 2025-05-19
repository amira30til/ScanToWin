import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionPermissionService } from './subscription-permission.service';
import { CreateSubscriptionPermissionDto } from './dto/create-subscription-permission.dto';
import { UpdateSubscriptionPermissionDto } from './dto/update-subscription-permission.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionPermission } from './entities/subscription-permission.entity';

@Controller('subscription-permission')
export class SubscriptionPermissionController {
  constructor(
    private readonly subscriptionPermissionService: SubscriptionPermissionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription permission' })
  @ApiResponse({
    status: 201,
    description: 'The subscription permission has been successfully created.',
    type: SubscriptionPermission,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(
    @Body() createSubscriptionPermissionDto: CreateSubscriptionPermissionDto,
  ) {
    return this.subscriptionPermissionService.create(
      createSubscriptionPermissionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscription permissions' })
  @ApiResponse({
    status: 200,
    description: 'Return all subscription permissions.',
    type: [SubscriptionPermission],
  })
  findAll() {
    return this.subscriptionPermissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription permission by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the subscription permission with the specified ID.',
    type: SubscriptionPermission,
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription permission not found.',
  })
  findOne(@Param('id') id: string) {
    return this.subscriptionPermissionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription permission' })
  @ApiResponse({
    status: 200,
    description: 'The subscription permission has been successfully updated.',
    type: SubscriptionPermission,
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription permission not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionPermissionDto: UpdateSubscriptionPermissionDto,
  ) {
    return this.subscriptionPermissionService.update(
      id,
      updateSubscriptionPermissionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription permission' })
  @ApiResponse({
    status: 200,
    description: 'The subscription permission has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription permission not found.',
  })
  remove(@Param('id') id: string) {
    return this.subscriptionPermissionService.remove(id);
  }
}
