import { Module } from '@nestjs/common';
import { PermessionService } from './permession.service';
import { PermessionController } from './permession.controller';

@Module({
  controllers: [PermessionController],
  providers: [PermessionService],
})
export class PermessionModule {}
