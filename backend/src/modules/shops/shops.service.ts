import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Not, Repository } from 'typeorm';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import {
  ChosenActionMessages,
  ShopMessages,
  UserMessages,
} from 'src/common/constants/messages.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { ShopStatus } from './enums/shop-status.enum';
import { Game } from '../game/entities/game.entity';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { VerifyGameCodeDto } from './dto/verify-game-code.dto';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';
import { RewardRedemption } from 'src/modules/reward-redemption/entities/reward-redemption.entity';
import { UserGame } from '../user-game/entities/user-game.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(ChosenAction)
    private readonly chosenActionRepository: Repository<ChosenAction>,
    @InjectRepository(RewardRedemption)
    private rewardRedemptionRepository: Repository<RewardRedemption>,
    @InjectRepository(UserGame)
    private readonly userGameRepository: Repository<UserGame>,
  ) {}

  async create(
    adminId: string,
    dto: CreateShopDto,
    logo?: Express.Multer.File,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id: adminId },
      });
      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(adminId));
      }

      const shopExists = await this.shopsRepository.findOne({
        where: {
          name: dto.name,
          adminId: adminId,
        },
      });
      if (shopExists) {
        throw new ConflictException(ShopMessages.SHOP_ALREADY_EXISTS('name'));
      }

      let logoUrl: string | undefined = undefined;
      if (logo) {
        try {
          const uploadResult =
            await this.cloudinaryService.uploadImageToCloudinary(logo);
          logoUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Logo upload failed:', uploadError);
          logoUrl = undefined;
        }
      }

      const newShop = this.shopsRepository.create({
        ...dto,
        adminId: adminId,
        status: ShopStatus.ACTIVE,
        logo: logoUrl,
      });

      const shopSaved = await this.shopsRepository.save(newShop);

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        shop: shopSaved,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<
    | ApiResponseInterface<{
        shops: Shop[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    try {
      const [shops, total] = await this.shopsRepository.findAndCount({
        where: { status: ShopStatus.ACTIVE },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['admin'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAllByAdmin(
    adminId: string,
    page = 1,
    limit = 10,
  ): Promise<
    | ApiResponseInterface<{
        shops: Shop[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id: adminId },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(adminId));
      }

      const [shops, total] = await this.shopsRepository.findAndCount({
        where: { adminId: adminId, status: ShopStatus.ACTIVE },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id, status: ShopStatus.ACTIVE },
        relations: ['admin'],
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(id));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shop,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOneByAdmin(
    id: string,
    adminId: string,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: {
          id: id,
          adminId: adminId,
          status: ShopStatus.ACTIVE,
        },
      });

      if (!shop) {
        throw new NotFoundException(
          ShopMessages.SHOP_NOT_FOUND_FOR_ADMIN(id, adminId),
        );
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shop,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    updateShopDto: UpdateShopDto,
    logo?: Express.Multer.File,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(id));
      }

      if (updateShopDto.name && updateShopDto.name !== shop.name) {
        const shopExists = await this.shopsRepository.findOne({
          where: {
            name: updateShopDto.name,
            adminId: shop.adminId,
          },
        });

        if (shopExists) {
          throw new ConflictException(ShopMessages.SHOP_ALREADY_EXISTS('name'));
        }
      }
      if (logo) {
        const result =
          await this.cloudinaryService.uploadImageToCloudinary(logo);
        updateShopDto.logo = result.url;
      }

      await this.shopsRepository.update(id, updateShopDto);

      const updatedShop = await this.shopsRepository.findOne({
        where: { id },
        relations: ['admin'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shop: updatedShop,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async updateByAdmin(
    id: string,
    adminId: string,
    updateShopDto: UpdateShopDto,
    file?: Express.Multer.File,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: {
          id: id,
          adminId: adminId,
        },
      });

      if (!shop || !id || !adminId) {
        throw new NotFoundException(
          ShopMessages.SHOP_NOT_FOUND_FOR_ADMIN(id, adminId),
        );
      }

      if (updateShopDto.name && updateShopDto.name !== shop.name) {
        const shopExists = await this.shopsRepository.findOne({
          where: {
            name: updateShopDto.name,
            adminId: adminId,
            id: Not(id),
          },
        });

        if (shopExists) {
          throw new ConflictException(ShopMessages.SHOP_ALREADY_EXISTS('name'));
        }
      }
      if (file) {
        const result =
          await this.cloudinaryService.uploadImageToCloudinary(file);
        updateShopDto.logo = result.url;
      }

      await this.shopsRepository.update(id, updateShopDto);

      const updatedShop = await this.shopsRepository.findOne({
        where: { id },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shop: updatedShop,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<
    ApiResponseInterface<{ message: string }> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id },
      });

      if (!shop || !id) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(id));
      }

      await this.shopsRepository.remove(shop);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: ShopMessages.SHOP_DELETE_SUCCESS(id),
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async removeByAdmin(
    shopId: string,
    adminId: string,
  ): Promise<
    ApiResponseInterface<{ message: string }> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId, adminId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }

      shop.status = ShopStatus.ARCHIVED;
      shop.admin = null;

      await this.shopsRepository.save(shop);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: `Shop with ID ${shopId} has been archived`,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(id));
      }

      shop.status = status;
      const updatedShop = await this.shopsRepository.save(shop);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shop: updatedShop,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async updateStatusByAdmin(
    id: string,
    adminId: string,
    status: string,
  ): Promise<ApiResponseInterface<Shop> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: {
          id: id,
          adminId: adminId,
        },
      });

      if (!shop) {
        throw new NotFoundException(
          ShopMessages.SHOP_NOT_FOUND_FOR_ADMIN(id, adminId),
        );
      }

      shop.status = status;
      const updatedShop = await this.shopsRepository.save(shop);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shop: updatedShop,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async getShopsByStatus(
    page = 1,
    limit = 10,
    status: ShopStatus,
  ): Promise<
    | ApiResponseInterface<{
        shops: Shop[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    try {
      const [shops, total] = await this.shopsRepository.findAndCount({
        where: { status },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async getShopsByStatusAndAdmin(
    status: ShopStatus,
    adminId: string,
    page = 1,
    limit = 10,
  ): Promise<
    | ApiResponseInterface<{
        shops: Shop[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id: adminId },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(adminId));
      }

      const [shops, total] = await this.shopsRepository.findAndCount({
        where: { adminId, status },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async verifyGameCodePin(
    dto: VerifyGameCodeDto,
  ): Promise<
    ApiResponseInterface<{ isValid: boolean }> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: dto.shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(dto.shopId));
      }

      // ✅ 24h cooldown check BEFORE code validation
      const userGame = await this.userGameRepository.findOne({
        where: {
          userId: dto.userId,
          shopId: dto.shopId,
        },
        order: { lastPlayedAt: 'DESC' },
      });

      if (userGame?.lastPlayedAt) {
        const now = new Date();
        const lastPlayed = new Date(userGame.lastPlayedAt);
        const timeDiffMs = now.getTime() - lastPlayed.getTime();

        const twentyFourHoursMs = 24 * 60 * 60 * 1000;
        if (timeDiffMs < twentyFourHoursMs) {
          const remainingMs = twentyFourHoursMs - timeDiffMs;
          const nextAllowedTime = new Date(
            lastPlayed.getTime() + twentyFourHoursMs,
          );

          return {
            statusCode: HttpStatus.BAD_REQUEST,
            error: {
              code: 'USER_COOLDOWN',
              message:
                'You can play again after 24 hours from your last game at this shop',
              timestamp: nextAllowedTime.getTime(),
              remainingTime: remainingMs,
              userId: dto.userId,
            },
          };
        }
      }

      const isValid = shop.gameCodePin === dto.gameCodePin;
      if (isValid) {
        const action = await this.chosenActionRepository.findOne({
          where: { id: dto.actionId },
        });

        if (!action || !dto.actionId) {
          throw new NotFoundException(
            ChosenActionMessages.NOT_FOUND(dto.actionId),
          );
        }
        const rewardRedemption = this.rewardRedemptionRepository.create({
          chosenAction: action,
          shop: shop,
        });
        await this.rewardRedemptionRepository.save(rewardRedemption);
      }

      return ApiResponse.success(HttpStatus.OK, {
        isValid,
        message: isValid
          ? ShopMessages.GAME_CODE_MATCHED
          : ShopMessages.GAME_CODE_MISMATCH,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
