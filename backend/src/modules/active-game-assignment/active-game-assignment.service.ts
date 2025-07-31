import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Admin } from 'typeorm';
import { Game } from '../game/entities/game.entity';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import {
  ChosenGameMessages,
  GameMessages,
  ShopMessages,
} from 'src/common/constants/messages.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { ApiResponse } from 'src/common/utils/response.util';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { AdminsService } from '../admins/admins.service';
import { ActiveGameAssignment } from './entities/active-game-assignment.entity';
//import { v4 as uuidv4 } from 'uuid';
import { Shop } from '../shops/entities/shop.entity';
import { GameStatus } from '../game/enums/game-status.enums';

@Injectable()
export class ActiveGameAssignmentService {
  constructor(
    @InjectRepository(ActiveGameAssignment)
    private readonly activeGameAssignmentRepository: Repository<ActiveGameAssignment>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly adminsService: AdminsService,
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}

  async findAll(): Promise<
    ApiResponseInterface<Admin> | ErrorResponseInterface
  > {
    try {
      const activeGame = await this.activeGameAssignmentRepository.find({
        relations: ['admin', 'game', 'shop'],
      });
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGame,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const activeGame = await this.activeGameAssignmentRepository.findOne({
        where: { id },
        relations: ['admin', 'game', 'userGames', 'shop'],
      });

      if (!activeGame) {
        throw new NotFoundException(
          ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id),
        );
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGame,
        message: ChosenGameMessages.CHOSEN_GAME_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const chosenGame = await this.activeGameAssignmentRepository.findOne({
        where: { id },
      });

      if (!chosenGame) {
        throw new NotFoundException(
          ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id),
        );
      }

      await this.activeGameAssignmentRepository.delete(id);
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: ChosenGameMessages.CHOSEN_GAME_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByAdmin(
    adminId: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsService.findOne(adminId);
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${adminId} not found`);
      }

      const activeGame = await this.activeGameAssignmentRepository.find({
        where: { admin: { id: adminId } },
        relations: ['game', 'userGames', 'shop'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGame,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByGame(
    gameId: string,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw new NotFoundException(`Game with ID ${gameId} not found`);
      }

      const activeGames = await this.activeGameAssignmentRepository.find({
        where: { game: { id: gameId } },
        relations: ['admin', 'userGames', 'shop'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGames,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  ///////////////////////////////////////////////////////////////////////

  async setActiveGameForShop(
    shopId: string,
    gameId: string,
    adminId: string,
  ): Promise<
    ApiResponseInterface<ActiveGameAssignment> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId },
      });
      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }

      const game = await this.gameRepository.findOne({
        where: { id: gameId, status: GameStatus.ACTIVE },
      });
      if (!game) {
        throw new NotFoundException(GameMessages.ACTIVE_GAME_NOT_FOUND(gameId));
      }

      const activeGame = await this.activeGameAssignmentRepository.findOne({
        where: { shopId },
      });

      if (activeGame) {
        activeGame.gameId = gameId;
        activeGame.adminId = adminId;

        const updatedGame =
          await this.activeGameAssignmentRepository.save(activeGame);

        return ApiResponse.success(HttpStatusCodes.SUCCESS, {
          data: updatedGame,
          message: GameMessages.ACTIVE_GAME_UPDATED,
        });
      } else {
        const newActiveGame = this.activeGameAssignmentRepository.create({
          shopId,
          gameId,
          adminId,
        });

        const savedGame =
          await this.activeGameAssignmentRepository.save(newActiveGame);
        return ApiResponse.success(HttpStatusCodes.SUCCESS, {
          data: savedGame,
          message: GameMessages.ACTIVE_GAME_ASSIGNED,
        });
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async getActiveGameForShop(
    shopId: string,
  ): Promise<
    ApiResponseInterface<ActiveGameAssignment> | ErrorResponseInterface
  > {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId },
      });
      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }

      const activeGame = await this.activeGameAssignmentRepository.findOne({
        where: { shopId, isActive: true },
        relations: ['game'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: activeGame ?? [],
        message: GameMessages.ACTIVE_GAME_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  //Ill leave this methode for the future just incase we wanted to decode the shop id
  async generateShopQrIdentifier(
    shopId: string,
  ): Promise<ApiResponseInterface<string> | ErrorResponseInterface> {
    try {
      const shop = await this.shopsRepository.findOne({
        where: { id: shopId },
      });

      if (!shop) {
        throw new NotFoundException(ShopMessages.SHOP_NOT_FOUND(shopId));
      }

      // if (!shop.qrCodeIdentifier) {
      //   shop.qrCodeIdentifier = uuidv4();
      //   await this.shopsRepository.save(shop);
      // }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: 'shop.qrCodeIdentifier',
        message: ShopMessages.QR_CODE_GENERATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  // async getShopByQrIdentifier(
  //   qrCodeIdentifier: string,
  // ): Promise<
  //   | ApiResponseInterface<{ shop: Shop; activeGame: ActiveGameAssignment }>
  //   | ErrorResponseInterface
  // > {
  //   try {
  //     const shop = await this.shopsRepository.findOne({
  //       where: { qrCodeIdentifier },
  //     });

  //     if (!shop) {
  //       throw new NotFoundException(ShopMessages.SHOP_QR_NOT_FOUND);
  //     }

  //     const activeGameResponse = await this.getActiveGameForShop(shop.id);

  //     if ('error' in activeGameResponse) {
  //       return activeGameResponse;
  //     }

  //     return ApiResponse.success(HttpStatusCodes.SUCCESS, {
  //       data: {
  //         shop,
  //         activeGame: activeGameResponse.data,
  //       },
  //       message: ShopMessages.SHOP_FETCHED_BY_QR,
  //     });
  //   } catch (error) {
  //     return handleServiceError(error);
  //   }
  // }
}
