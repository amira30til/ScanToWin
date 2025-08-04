import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { UserMessages } from 'src/common/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AdminStatus } from './enums/admin-status.enum';
import { Shop } from '../shops/entities/shop.entity';
import { ShopStatus } from '../shops/enums/shop-status.enum';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}
  /*--------------------------------CREATE USER(Admin or Super-Admin )-------------------------------*/
  async create(
    dto: CreateAdminDto,
    profilPicture?: Express.Multer.File,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      if (dto.email) {
        const emailExists = await this.adminsRepository.findOne({
          where: { email: dto.email.toLowerCase() },
        });
        if (emailExists) {
          throw new ConflictException(
            UserMessages.USER_ALREADY_EXISTS('email'),
          );
        }
      }

      let profilePictureUrl: string | null = null;
      if (profilPicture) {
        try {
          const uploadResult =
            await this.cloudinaryService.uploadImageToCloudinary(profilPicture);
          profilePictureUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);

          profilePictureUrl = null;
        }
      }

      const newUser = this.adminsRepository.create({
        ...dto,
        email: dto.email?.toLowerCase(),
        profilPicture: profilePictureUrl || undefined,
      });

      const salt = await bcrypt.genSalt();
      newUser.password = await bcrypt.hash(newUser.password, salt);

      const userSaved = await this.adminsRepository.save(newUser);

      const { ...userResponse } = userSaved;

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        user: userResponse,
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
        admins: Admin[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    try {
      const [admins, total] = await this.adminsRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admins,
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
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id, adminStatus: AdminStatus.ACTIVE },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admin,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByEmail(
    email: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { email: email.toLowerCase(), adminStatus: AdminStatus.ACTIVE },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.EMAIL_USER_NOT_FOUND(email));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admin,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    profilPicture?: Express.Multer.File,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id, adminStatus: AdminStatus.ACTIVE },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }

      if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
        const emailExists = await this.adminsRepository.findOne({
          where: { email: updateAdminDto.email.toLowerCase() },
        });

        if (emailExists) {
          throw new ConflictException(
            UserMessages.USER_ALREADY_EXISTS('email'),
          );
        }

        updateAdminDto.email = updateAdminDto.email.toLowerCase();
      }

      if (profilPicture) {
        const result =
          await this.cloudinaryService.uploadImageToCloudinary(profilPicture);
        updateAdminDto.profilPicture = result.url;
      }

      await this.adminsRepository.update(id, updateAdminDto);

      const updatedAdmin = await this.adminsRepository.findOne({
        where: { id },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admin: updatedAdmin,
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
      const admin = await this.adminsRepository.findOne({ where: { id } });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }

      admin.adminStatus = AdminStatus.ARCHIVED;
      await this.adminsRepository.save(admin);

      await this.shopsRepository.update(
        { adminId: admin.id },
        { status: ShopStatus.ARCHIVED },
      );

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: `Admin with ID ${id} has been archived`,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }

      admin.adminStatus = status;
      const updatedAdmin = await this.adminsRepository.save(admin);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admin: updatedAdmin,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  /*--------------------------------SUPER Admin section-------------------------------*/
  async findAllAdmins(
    page = 1,
    limit = 10,
  ): Promise<
    | ApiResponseInterface<{
        admins: Admin[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    try {
      const [admins, total] = await this.adminsRepository.findAndCount({
        where: { role: 'ADMIN', adminStatus: AdminStatus.ACTIVE },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admins,
        total,
        page,
        limit,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async restore(
    id: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id },
      });

      if (!admin) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }

      admin.adminStatus = AdminStatus.ACTIVE;
      const updatedAdmin = await this.adminsRepository.save(admin);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admin: updatedAdmin,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
