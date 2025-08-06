import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminStatus } from './enums/admin-status.enum';
import { AdminGuard, SuperAdminGuard } from '../auth/guards/admins.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Admin } from './entities/admin.entity';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /*--------------------------------CREATE USER-------------------------------*/
  @Post()
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @UseInterceptors(FileInterceptor('profilPicture'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Admin with optional profile picture',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'admin@example.com' },
        password: { type: 'string', example: 'StrongP@ss123' },
        role: { type: 'string', example: 'ADMIN' },
        adminStatus: { type: 'string', example: 'ACTIVE' },
        mailStatus: { type: 'boolean', example: true },
        profilPicture: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiOperation({ summary: 'Create Admin or Super Admin' })
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() profilPicture: Express.Multer.File,
  ) {
    const payload = { ...createAdminDto, createdAt: new Date() };
    return this.adminsService.create(payload, profilPicture);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @ApiOperation({
    summary: 'Get all admin users',
    description:
      'Retrieves all admin users with pagination. Requires SUPER_ADMIN role.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Results per page (default: 10)',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of admin users retrieved successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {
          properties: {
            admins: {
              type: 'array',
            },
            total: { type: 'number', example: 25 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN or ADMIN role',
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get admin by ID',
    description:
      'Retrieves an admin user by ID. Requires SUPER_ADMIN or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user retrieved successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN or ADMIN role',
  })
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Get('email/:email')
  @ApiOperation({
    summary: 'Get admin by email',
    description: 'Retrieves an admin user by email. Requires SUPER_ADMIN role.',
  })
  @ApiParam({ name: 'email', description: 'Admin email', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user retrieved successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN or ADMIN role',
  })
  findByEmail(@Param('email') email: string) {
    return this.adminsService.findByEmail(email);
  }
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('profilPicture'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAdminDto })
  @ApiOperation({
    summary: 'Update admin user',
    description:
      'Updates an admin user by ID. Requires SUPER_ADMIN or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user updated successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile() profilPicture: Express.Multer.File,
  ) {
    return this.adminsService.update(id, updateAdminDto, profilPicture);
  }
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete admin user',
    description: 'Removes an admin user by ID. Requires SUPER_ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin user removed successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {
          properties: {
            message: {
              type: 'string',
              example: 'Admin with ID 1 has been successfully removed',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN role',
  })
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update admin status',
    description:
      'Updates admin status (ACTIVE/INACTIVE). Requires SUPER_ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: String })
  @ApiBody({
    schema: {
      properties: {
        status: {
          type: 'string',
          enum: [AdminStatus.ACTIVE, AdminStatus.INACTIVE],
          example: AdminStatus.ACTIVE,
        },
      },
    },
    description: 'Admin status to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin status updated successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin user not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN role',
  })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminsService.updateStatus(id, status);
  }
  @Patch(':id/restore')
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @ApiOperation({
    summary: 'Restore an archived admin',
    description:
      'Restores an admin by setting their status back to ACTIVE. Requires SUPER_ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the archived admin to restore',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin restored successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          properties: {
            admin: {
              type: 'object',
              description: 'Restored admin entity',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN role',
  })
  restore(@Param('id') id: string) {
    return this.adminsService.updateStatus(id, AdminStatus.ACTIVE);
  }
  @Get('by-id/:id')
  @ApiOperation({
    summary: 'Get Admins by ID and Status (with optional pagination)',
    description: `Fetch a list of admins by their unique ID and status. Supports optional pagination. Also returns related entities: shops, rewards, users, chosenAction, and activeGameAssignments.`,
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the admin to fetch',
    type: String,
    example: 'a7e5d2e2-9c5e-4c1a-a9b5-fc8b1d5f9b12',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched list of admins',
    type: Admin,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  async getAdminsByIdAndStatus(
    @Param('id') id: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    return this.adminsService.findAdminById(id);
  }
  //@ApiBearerAuth()
  //@UseGuards(SuperAdminGuard)
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a Admin by ID (Super Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the Admin to delete',
    type: String,
  })
  removeAdmin(@Param('id') id: string) {
    return this.adminsService.removeAdmin(id);
  }
}
