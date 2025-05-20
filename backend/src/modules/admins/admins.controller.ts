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
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminStatus } from './enums/admin-status.enum';
import { AdminGuard, SuperAdminGuard } from '../auth/guards/admins.guard';
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /*--------------------------------CREATE USER-------------------------------*/
  @Post()
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Create Admin or Super Admin' })
  create(@Body() createAdminDto: CreateAdminDto) {
    const payload = { ...createAdminDto, createdAt: new Date() };
    return this.adminsService.create(payload);
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
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
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
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update admin user',
    description:
      'Updates an admin user by ID. Requires SUPER_ADMIN or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  @ApiBody({ type: UpdateAdminDto, description: 'Admin data to update' })
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
    description: 'User with this email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - requires SUPER_ADMIN role',
  })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }
  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete admin user',
    description: 'Removes an admin user by ID. Requires SUPER_ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
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
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
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
}
