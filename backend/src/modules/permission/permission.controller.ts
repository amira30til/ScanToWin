import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionService } from './permission.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Permission } from './entities/permession.entity';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
@Controller('permession')
export class PermessionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: Permission,
  })
  @ApiBody({ type: CreatePermissionDto })
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<ApiResponseInterface<Permission> | ErrorResponseInterface> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Return all permissions',
    type: [Permission],
  })
  findAll(): Promise<
    ApiResponseInterface<Permission[]> | ErrorResponseInterface
  > {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the permission wrapped in ApiResponseInterface',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          permission: {
            id: 1,
            key: 'READ_ONLY',
            description: 'Read-only access',
            createdAt: '2025-05-08T12:00:00Z',
            updatedAt: '2025-05-08T12:00:00Z',
          },
        },
      },
    },
  })
  findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseInterface<Permission> | ErrorResponseInterface> {
    return this.permissionService.findOne(+id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully updated.',
    type: Permission,
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: CreatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
