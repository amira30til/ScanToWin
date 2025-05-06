import { Injectable } from '@nestjs/common';
import { CreateSubscriptionPermissionDto } from './dto/create-subscription-permission.dto';
import { UpdateSubscriptionPermissionDto } from './dto/update-subscription-permission.dto';

@Injectable()
export class SubscriptionPermissionService {
  create(createSubscriptionPermissionDto: CreateSubscriptionPermissionDto) {
    return 'This action adds a new subscriptionPermission';
  }

  findAll() {
    return `This action returns all subscriptionPermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionPermission`;
  }

  update(id: number, updateSubscriptionPermissionDto: UpdateSubscriptionPermissionDto) {
    return `This action updates a #${id} subscriptionPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionPermission`;
  }
}
