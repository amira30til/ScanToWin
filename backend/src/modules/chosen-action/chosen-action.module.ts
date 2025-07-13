import { Module } from '@nestjs/common';
import { ChosenActionService } from './chosen-action.service';
import { ChosenActionController } from './chosen-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChosenAction } from './entities/chosen-action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChosenAction,])],
  controllers: [ChosenActionController],
  providers: [ChosenActionService],
  exports: [ChosenActionService]
})
export class ChosenActionModule {}
