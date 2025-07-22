import { Module } from '@nestjs/common';
import { ActionClickService } from './action-click.service';
import { ActionClickController } from './action-click.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionClick } from './entities/action-click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionClick])],
  controllers: [ActionClickController],
  providers: [ActionClickService],
  exports: [ActionClickService],
})
export class ActionClickModule {}
