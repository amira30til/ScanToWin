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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Shop } from './entities/shop.entity';
import { ShopStatus } from './enums/shop-status.enum';
import { AdminGuard, SuperAdminGuard } from '../auth/guards/admins.guard';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifyGameCodeDto } from './dto/verify-game-code.dto';

@ApiTags('shops')
@ApiBearerAuth()
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

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

  // @ApiBearerAuth()
  //@UseGuards(AdminGuard)
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
    type: String,
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
    type: String,
  })
  findAllByAdmin(
    @Param('adminId') adminId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.shopsService.findAllByAdmin(adminId, page, limit);
  }

  // @ApiBearerAuth()
  // @UseGuards(SuperAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a shop by ID ' })
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
    type: String,
  })
  findOne(@Param('id') id: string) {
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
    type: String,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: String,
  })
  findOneByAdmin(@Param('id') id: string, @Param('adminId') adminId: string) {
    return this.shopsService.findOneByAdmin(id, adminId);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateShopDto })
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
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.shopsService.update(id, updateShopDto, logo);
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
    type: String,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiBody({ type: UpdateShopDto })
  updateByAdmin(
    @Param('id') id: string,
    @Param('adminId') adminId: string,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.shopsService.updateByAdmin(id, adminId, updateShopDto, logo);
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
    type: String,
  })
  remove(@Param('id') id: string) {
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
    type: String,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: String,
  })
  removeByAdmin(@Param('id') id: string, @Param('adminId') adminId: string) {
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
    type: String,
  })
  @ApiQuery({
    name: 'status',
    description: 'New status for the shop',
    enum: ShopStatus,
    required: true,
  })
  updateStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.shopsService.updateStatus(id, status);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Patch(':id/admin/:adminId/status')
  @ApiOperation({
    summary: 'Update shop status for specific admin only by SUPER ADMIN',
  })
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
    type: String,
  })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin',
    type: String,
  })
  @ApiQuery({
    name: 'status',
    description: 'New status for the shop',
    enum: ShopStatus,
    required: true,
  })
  updateStatusByAdmin(
    @Param('id') id: string,
    @Param('adminId') adminId: string,
    @Query('status') status: string,
  ) {
    return this.shopsService.updateStatusByAdmin(id, adminId, status);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('by-status')
  @ApiOperation({ summary: 'Get all shops by status' })
  @ApiQuery({ name: 'status', enum: ShopStatus, required: true })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'List of shops by status' })
  async getShopsByStatus(
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('limit', new ParseIntPipe()) limit = 10,
    @Query('status') status: ShopStatus,
  ): Promise<
    | ApiResponseInterface<{
        shops: Shop[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    return await this.shopsService.getShopsByStatus(page, limit, status);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('by-status-admin')
  @ApiOperation({ summary: 'Get shops by status and admin ID' })
  @ApiQuery({ name: 'status', enum: ShopStatus, required: true })
  @ApiQuery({ name: 'adminId', type: String, required: true })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of shops by status and admin ID',
  })
  async getShopsByStatusAndAdmin(
    @Query('status') status: ShopStatus,
    @Query('adminId') adminId: string,
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('limit', new ParseIntPipe()) limit = 10,
  ): Promise<
    | ApiResponseInterface<{
        shops: Shop[];
        total: number;
        page: number;
        limit: number;
      }>
    | ErrorResponseInterface
  > {
    return await this.shopsService.getShopsByStatusAndAdmin(
      status,
      adminId,
      page,
      limit,
    );
  }
  @Post('verify-game-code')
  @ApiOperation({ summary: 'Verify shop game code pin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns true if the game code matches',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  async verifyGameCode(
    @Body() dto: VerifyGameCodeDto,
  ): Promise<
    ApiResponseInterface<{ isValid: boolean }> | ErrorResponseInterface
  > {
    return this.shopsService.verifyGameCodePin(dto);
  }
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Shop with optional logo upload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'ZVAAAAAAAAAAAA' },
        address: { type: 'string', example: '123 Main Street' },
        city: { type: 'string', example: 'New York' },
        country: { type: 'string', example: 'USA' },
        zipCode: { type: 'number', example: 10001 },
        nbSiret: { type: 'number', example: 12345678900000 },
        tel: { type: 'string', example: '+1234567890' },
        gameColor1: { type: 'string', example: '#FF5733' },
        gameColor2: { type: 'string', example: '#33FFBD' },
        gameCodePin: { type: 'number', example: 1234 },
        isGuaranteedWin: { type: 'boolean', example: false },
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name'],
    },
  })
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
    type: String,
    required: true,
  })
  create(
    @Param('adminId') adminId: string,
    @Body() createShopDto: CreateShopDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.shopsService.create(adminId, createShopDto, logo);
  }
}
