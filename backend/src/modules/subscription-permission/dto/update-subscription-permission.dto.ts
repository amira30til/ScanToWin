import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionPermissionDto } from './create-subscription-permission.dto';

export class UpdateSubscriptionPermissionDto extends PartialType(
  CreateSubscriptionPermissionDto,
) {}
