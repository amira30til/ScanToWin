import { Module } from '@nestjs/common';
import { PermessionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permession.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermessionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
