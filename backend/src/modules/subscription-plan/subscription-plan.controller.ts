import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionPlan } from './entities/subscription-plan.entity';

@Controller('subscription-plan')
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan' })
  @ApiResponse({
    status: 201,
    description: 'The subscription plan has been successfully created.',
    type: SubscriptionPlan,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'Return all subscription plans.',
    type: [SubscriptionPlan],
  })
  findAll() {
    return this.subscriptionPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription plan by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the subscription plan with the specified ID.',
    type: SubscriptionPlan,
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found.' })
  findOne(@Param('id') id: string) {
    return this.subscriptionPlanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription plan' })
  @ApiResponse({
    status: 200,
    description: 'The subscription plan has been successfully updated.',
    type: SubscriptionPlan,
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found.' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlanService.update(id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  @ApiResponse({
    status: 200,
    description: 'The subscription plan has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found.' })
  remove(@Param('id') id: string) {
    return this.subscriptionPlanService.remove(id);
  }
}
