import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminSubscriptionService } from './admin-subscription.service';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';
import { UpdateAdminSubscriptionDto } from './dto/update-admin-subscription.dto';

@Controller('admin-subscription')
export class AdminSubscriptionController {
  constructor(
    private readonly adminSubscriptionService: AdminSubscriptionService,
  ) {}

  @Post()
  create(@Body() createAdminSubscriptionDto: CreateAdminSubscriptionDto) {
    return this.adminSubscriptionService.create(createAdminSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.adminSubscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminSubscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminSubscriptionDto: UpdateAdminSubscriptionDto,
  ) {
    return this.adminSubscriptionService.update(
      +id,
      updateAdminSubscriptionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminSubscriptionService.remove(+id);
  }
}
