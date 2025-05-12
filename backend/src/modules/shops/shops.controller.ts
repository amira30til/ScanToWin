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
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Shop } from './entities/shop.entity';
import { ShopStatus } from './enums/shop-status.enum';
import { AdminGuard, SuperAdminGuard } from '../auth/guards/admins.guard';

@ApiTags('shops')
@ApiBearerAuth()
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post(':adminId')
  @ApiOperation({ summary: 'Create a new shop ' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shop created successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Shop with this name already exists',
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin to create shop for',
    type: Number,
    required: true,
  })
  create(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() createShopDto: CreateShopDto,
  ) {
    return this.shopsService.create(adminId, createShopDto);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all shops with pagination (Super Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved all shops successfully',
    type: [Shop],
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: Number,
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.shopsService.findAll(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('admin/:adminId')
  @ApiOperation({ summary: 'Get all shops for a specific admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved all shops for admin successfully',
    type: [Shop],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: Number,
  })
  findAllByAdmin(
    @Param('adminId') adminId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.shopsService.findAllByAdmin(adminId, page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a shop by ID (Super Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved shop successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to retrieve',
    type: Number,
  })
  findOne(@Param('id') id: number) {
    return this.shopsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get(':id/admin/:adminId')
  @ApiOperation({ summary: 'Get a shop by ID for specific admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved shop successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found for this admin',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to retrieve',
    type: Number,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: Number,
  })
  findOneByAdmin(@Param('id') id: number, @Param('adminId') adminId: number) {
    return this.shopsService.findOneByAdmin(id, adminId);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a shop by ID (Super Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shop updated successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Shop with this name already exists',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to update',
    type: Number,
  })
  update(@Param('id') id: number, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id/admin/:adminId')
  @ApiOperation({ summary: 'Update a shop by ID for specific admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shop updated successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found for this admin',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Shop with this name already exists for this admin',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to update',
    type: Number,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: Number,
  })
  updateByAdmin(
    @Param('id') id: number,
    @Param('adminId') adminId: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopsService.updateByAdmin(id, adminId, updateShopDto);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shop by ID (Super Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shop deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to delete',
    type: Number,
  })
  remove(@Param('id') id: number) {
    return this.shopsService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id/admin/:adminId')
  @ApiOperation({ summary: 'Delete a shop by ID for specific admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shop deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found for this admin',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to delete',
    type: Number,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: Number,
  })
  removeByAdmin(@Param('id') id: number, @Param('adminId') adminId: number) {
    return this.shopsService.removeByAdmin(id, adminId);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update shop status (Super Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shop status updated successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to update status',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    description: 'New status for the shop',
    enum: ShopStatus,
    required: true,
  })
  updateStatus(@Param('id') id: number, @Query('status') status: string) {
    return this.shopsService.updateStatus(id, status);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id/admin/:adminId/status')
  @ApiOperation({ summary: 'Update shop status for specific admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shop status updated successfully',
    type: Shop,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found for this admin',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the shop to update status',
    type: Number,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    description: 'New status for the shop',
    enum: ShopStatus,
    required: true,
  })
  updateStatusByAdmin(
    @Param('id') id: number,
    @Param('adminId') adminId: number,
    @Query('status') status: string,
  ) {
    return this.shopsService.updateStatusByAdmin(id, adminId, status);
  }
}
