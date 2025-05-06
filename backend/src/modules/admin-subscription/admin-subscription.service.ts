import { Injectable } from '@nestjs/common';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';
import { UpdateAdminSubscriptionDto } from './dto/update-admin-subscription.dto';

@Injectable()
export class AdminSubscriptionService {
  create(createAdminSubscriptionDto: CreateAdminSubscriptionDto) {
    return 'This action adds a new adminSubscription';
  }

  findAll() {
    return `This action returns all adminSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminSubscription`;
  }

  update(id: number, updateAdminSubscriptionDto: UpdateAdminSubscriptionDto) {
    return `This action updates a #${id} adminSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminSubscription`;
  }
}
