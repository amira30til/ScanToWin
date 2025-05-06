import { Module } from '@nestjs/common';
import { ChosenActionService } from './chosen-action.service';
import { ChosenActionController } from './chosen-action.controller';

@Module({
  controllers: [ChosenActionController],
  providers: [ChosenActionService],
})
export class ChosenActionModule {}
