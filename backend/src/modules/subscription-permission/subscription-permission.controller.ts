import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionPermissionService } from './subscription-permission.service';
import { CreateSubscriptionPermissionDto } from './dto/create-subscription-permission.dto';
import { UpdateSubscriptionPermissionDto } from './dto/update-subscription-permission.dto';

@Controller('subscription-permission')
export class SubscriptionPermissionController {
  constructor(private readonly subscriptionPermissionService: SubscriptionPermissionService) {}

  @Post()
  create(@Body() createSubscriptionPermissionDto: CreateSubscriptionPermissionDto) {
    return this.subscriptionPermissionService.create(createSubscriptionPermissionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionPermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionPermissionDto: UpdateSubscriptionPermissionDto) {
    return this.subscriptionPermissionService.update(+id, updateSubscriptionPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionPermissionService.remove(+id);
  }
}
