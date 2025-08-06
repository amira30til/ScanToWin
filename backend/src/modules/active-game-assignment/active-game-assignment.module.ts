import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../game/entities/game.entity';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import { ActiveGameAssignment } from './entities/active-game-assignment.entity';
import { ActiveGameAssignmentController } from './active-game-assignment.controller';
import { ActiveGameAssignmentService } from './active-game-assignment.service';
import { Shop } from '../shops/entities/shop.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveGameAssignment, Game, Admin, Shop]),
  ],
  controllers: [ActiveGameAssignmentController],
  providers: [ActiveGameAssignmentService, AdminsService, CloudinaryService],
  exports: [ActiveGameAssignmentService],
})
export class ActiveGameAssignmentModule {}
