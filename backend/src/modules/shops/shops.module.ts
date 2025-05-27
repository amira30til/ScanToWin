import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { Shop } from './entities/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admins/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { Game } from '../game/entities/game.entity';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Admin, ActiveGameAssignment, Game]),
  ],
  controllers: [ShopsController],
  providers: [ShopsService, JwtService,CloudinaryService],
  exports: [ShopsService],
})
export class ShopsModule {}
