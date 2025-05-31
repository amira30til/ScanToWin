import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveGameAssignmentService } from './active-game-assignment.service';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
//import { Shop } from '../shops/entities/shop.entity';
import { ActiveGameAssignment } from './entities/active-game-assignment.entity';
@ApiTags('Active Game Assignment')
@Controller('active-game-assignment')
export class ActiveGameAssignmentController {
  constructor(
    private readonly activeGameAssignmentService: ActiveGameAssignmentService,
  ) {}
  @Post(':shopId/games/:gameId/assign/:adminId')
  @ApiOperation({
    summary: 'Set active game for a shop',
    description:
      'Assigns a game as active for a specific shop and deactivates any previously active game for that shop.',
  })
  @ApiParam({ name: 'shopId', description: 'ID of the shop', type: String })
  @ApiParam({
    name: 'gameId',
    description: 'ID of the game to assign',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game successfully assigned to shop',
    type: ActiveGameAssignment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop or game not found',
  })
  async setActiveGameForShop(
    @Param('shopId') shopId: string,
    @Param('gameId') gameId: string,
    @Param('adminId') adminId: string,
  ): Promise<
    ApiResponseInterface<ActiveGameAssignment> | ErrorResponseInterface
  > {
    return await this.activeGameAssignmentService.setActiveGameForShop(
      shopId,
      gameId,
      adminId,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Get all chosen games' })
  @ApiResponse({
    status: 200,
    description: 'Chosen games fetched successfully',
  })
  async findAll() {
    return this.activeGameAssignmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chosen game by ID' })
  @ApiResponse({ status: 200, description: 'Chosen game fetched successfully' })
  @ApiResponse({ status: 404, description: 'Chosen game not found' })
  async findOne(@Param('id') id: string) {
    return this.activeGameAssignmentService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chosen game' })
  @ApiResponse({ status: 200, description: 'Chosen game deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chosen game not found' })
  async remove(@Param('id') id: string) {
    return this.activeGameAssignmentService.remove(id);
  }

  @Get('by-admin/:adminId')
  @ApiOperation({ summary: 'Get chosen games by admin ID' })
  @ApiResponse({
    status: 200,
    description: 'Chosen games fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findByAdmin(@Param('adminId') adminId: string) {
    return this.activeGameAssignmentService.findByAdmin(adminId);
  }

  @Get('by-game/:gameId')
  @ApiOperation({ summary: 'Get chosen games by game ID' })
  @ApiResponse({
    status: 200,
    description: 'Chosen games fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findByGame(@Param('gameId') gameId: string) {
    return this.activeGameAssignmentService.findByGame(gameId);
  }
  //////////////////////////////////////////

  @Get(':shopId/active-game')
  @ApiOperation({
    summary: 'Get active game for a shop',
    description:
      'Retrieves the currently active game assignment for a specific shop.',
  })
  @ApiParam({ name: 'shopId', description: 'ID of the shop', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active game found',
    type: ActiveGameAssignment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found or no active game for shop',
  })
  async getActiveGameForShop(
    @Param('shopId') shopId: string,
  ): Promise<
    ApiResponseInterface<ActiveGameAssignment> | ErrorResponseInterface
  > {
    return await this.activeGameAssignmentService.getActiveGameForShop(shopId);
  }

  @Post(':shopId/generate-qr')
  @ApiOperation({
    summary: 'Generate QR code identifier for a shop',
    description:
      'Generates a unique QR code identifier for a shop if one does not already exist.',
  })
  @ApiParam({ name: 'shopId', description: 'ID of the shop', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'QR code identifier generated or retrieved',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: 'QR code identifier' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  async generateShopQrIdentifier(
    @Param('shopId') shopId: string,
  ): Promise<ApiResponseInterface<string> | ErrorResponseInterface> {
    return await this.activeGameAssignmentService.generateShopQrIdentifier(
      shopId,
    );
  }

  // // @Get('by-qr/:qrCodeIdentifier')
  // // @ApiOperation({
  // //   summary: 'Get shop by QR identifier',
  // //   description:
  // //     'Retrieves shop details and active game using the QR code identifier.',
  // // })
  // // @ApiParam({
  // //   name: 'qrCodeIdentifier',
  // //   description: 'QR code identifier of the shop',
  // //   type: String,
  // // })
  // // @ApiResponse({
  // //   status: HttpStatus.OK,
  // //   description: 'Shop and active game details',
  // //   schema: {
  // //     type: 'object',
  // //     properties: {
  // //       shop: { $ref: '#/components/schemas/Shop' },
  // //       activeGame: { $ref: '#/components/schemas/ActiveGameAssignment' },
  // //     },
  // //   },
  // // })
  // // @ApiResponse({
  // //   status: HttpStatus.NOT_FOUND,
  // //   description: 'Shop not found for the given QR identifier',
  // // })
  // // async getShopByQrIdentifier(
  // //   @Param('qrCodeIdentifier') qrCodeIdentifier: string,
  // // ): Promise<
  // //   | ApiResponseInterface<{ shop: Shop; activeGame: ActiveGameAssignment }>
  // //   | ErrorResponseInterface
  // // > {
  // //   return await this.activeGameAssignmentService.getShopByQrIdentifier(
  // //     qrCodeIdentifier,
  // //   );
  // // }
}
