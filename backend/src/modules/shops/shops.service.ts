import {
  ConflictException,
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
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(ActiveGameAssignment)
    private readonly activeGameAssignmentRepository: Repository<ActiveGameAssignment>,
  ) {}

  async create(
    adminId: string,
    dto: CreateShopDto,
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

      const newShop = this.shopsRepository.create({
        ...dto,
        adminId: adminId,
        status: ShopStatus.ACTIVE,
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
        where: { adminId: adminId },
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
        where: { id },
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

      if (!shop) {
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
    id: string,
    adminId: string,
  ): Promise<
    ApiResponseInterface<{ message: string }> | ErrorResponseInterface
  > {
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

      await this.shopsRepository.remove(shop);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: ShopMessages.SHOP_DELETE_SUCCESS(id),
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
}
