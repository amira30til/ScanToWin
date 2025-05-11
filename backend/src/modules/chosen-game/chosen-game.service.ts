import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChosenGameDto } from './dto/create-chosen-game.dto';
import { UpdateChosenGameDto } from './dto/update-chosen-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Admin } from 'typeorm';
import { Game } from '../game/entities/game.entity';
import { ChosenGame } from './entities/chosen-game.entity';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { ChosenGameMessages } from 'src/common/constants/messages.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { ApiResponse } from 'src/common/utils/response.util';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { AdminsService } from '../admins/admins.service';

@Injectable()
export class ChosenGameService {
  constructor(
    @InjectRepository(ChosenGame)
    private readonly chosenGameRepository: Repository<ChosenGame>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly adminsService: AdminsService,
  ) {}
  async create(
    createDto: CreateChosenGameDto,
  ): Promise<ApiResponseInterface<ChosenGame> | ErrorResponseInterface> {
    try {
      const adminResponse = await this.adminsService.findOne(createDto.adminId);

      if ('error' in adminResponse) {
        return adminResponse;
      }

      const admin = adminResponse.data;
      console.log('admin', admin);

      const game = await this.gameRepository.findOne({
        where: { id: createDto.gameId },
      });
      if (!game) {
        throw new NotFoundException(
          `Game with ID ${createDto.gameId} not found`,
        );
      }

      const existingChosenGame = await this.chosenGameRepository.findOne({
        where: { name: createDto.name, admin: { id: createDto.adminId } },
      });

      if (existingChosenGame) {
        throw new ConflictException(
          ChosenGameMessages.CHOSEN_GAME_ALREADY_EXISTS('name'),
        );
      }

      const newChosenGame = this.chosenGameRepository.create({
        ...createDto,
        adminId: admin.id,
        game,
      });
      console.log('adminnnnnn', admin);

      console.log('ici before save', newChosenGame);

      const savedChosenGame =
        await this.chosenGameRepository.save(newChosenGame);
      return ApiResponse.success(HttpStatusCodes.CREATED, {
        chosenGame: savedChosenGame,
        message: ChosenGameMessages.CHOSEN_GAME_CREATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: number,
    updateDto: UpdateChosenGameDto,
  ): Promise<ApiResponseInterface<ChosenGame> | ErrorResponseInterface> {
    try {
      const chosenGame = await this.chosenGameRepository.findOne({
        where: { id },
        relations: ['admin', 'game'],
      });

      if (!chosenGame) {
        throw new NotFoundException(
          ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id),
        );
      }

      // Check if admin exists if being updated
      if (updateDto.adminId && updateDto.adminId !== chosenGame.admin.id) {
        const adminResponse = await this.adminsService.findOne(
          updateDto.adminId,
        );

        if ('error' in adminResponse) {
          return adminResponse;
        }

        const newAdmin = adminResponse.data;

        if (!newAdmin) {
          throw new NotFoundException(
            `Admin with ID ${updateDto.adminId} not found`,
          );
        }

        chosenGame.admin = newAdmin;
      }

      // Check if game exists if being updated
      if (updateDto.gameId && updateDto.gameId !== chosenGame.gameId) {
        const newGame = await this.gameRepository.findOne({
          where: { id: updateDto.gameId },
        });

        if (!newGame) {
          throw new NotFoundException(
            `Game with ID ${updateDto.gameId} not found`,
          );
        }

        chosenGame.game = newGame;
        chosenGame.gameId = updateDto.gameId;
      }

      // Check if name is being changed and conflicts with existing
      if (updateDto.name && updateDto.name !== chosenGame.name) {
        const existingChosenGame = await this.chosenGameRepository.findOne({
          where: {
            name: updateDto.name,
            admin: { id: chosenGame.admin.id },
          },
        });

        if (existingChosenGame && existingChosenGame.id !== id) {
          throw new ConflictException(
            ChosenGameMessages.CHOSEN_GAME_ALREADY_EXISTS('name'),
          );
        }
      }

      // Update other fields
      Object.assign(chosenGame, {
        ...updateDto,
        admin: chosenGame.admin,
        game: chosenGame.game,
      });

      const updatedChosenGame =
        await this.chosenGameRepository.save(chosenGame);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenGame: updatedChosenGame,
        message: ChosenGameMessages.CHOSEN_GAME_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
  async findAll(): Promise<
    ApiResponseInterface<Admin> | ErrorResponseInterface
  > {
    try {
      const chosenGames = await this.chosenGameRepository.find({
        relations: ['admin', 'game'],
      });
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenGames,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: number,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const chosenGame = await this.chosenGameRepository.findOne({
        where: { id },
        relations: ['admin', 'game', 'userGames'],
      });

      if (!chosenGame) {
        throw new NotFoundException(
          ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id),
        );
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenGame,
        message: ChosenGameMessages.CHOSEN_GAME_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: number,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const chosenGame = await this.chosenGameRepository.findOne({
        where: { id },
      });

      if (!chosenGame) {
        throw new NotFoundException(
          ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id),
        );
      }

      await this.chosenGameRepository.delete(id);
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: ChosenGameMessages.CHOSEN_GAME_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByAdmin(
    adminId: number,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const admin = await this.adminsService.findOne(adminId);
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${adminId} not found`);
      }

      const chosenGames = await this.chosenGameRepository.find({
        where: { admin: { id: adminId } },
        relations: ['game', 'userGames'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenGames,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByGame(
    gameId: number,
  ): Promise<ApiResponseInterface<Admin> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw new NotFoundException(`Game with ID ${gameId} not found`);
      }

      const chosenGames = await this.chosenGameRepository.find({
        where: { game: { id: gameId } },
        relations: ['admin', 'userGames'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenGames,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
