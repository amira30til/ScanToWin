import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { GameMessages } from 'src/common/constants/messages.constants';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}
  async create(
    createGameDto: CreateGameDto,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const existingGame = await this.gameRepository.findOne({
        where: { name: createGameDto.name },
      });

      if (existingGame) {
        throw new ConflictException(GameMessages.GAME_ALREADY_EXISTS('name'));
      }

      const newGame = this.gameRepository.create({
        ...createGameDto,
        isActive: createGameDto.isActive ?? true,
      });

      const savedGame = await this.gameRepository.save(newGame);
      return ApiResponse.success(HttpStatusCodes.CREATED, {
        game: savedGame,
        message: GameMessages.GAME_CREATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<Game> | ErrorResponseInterface
  > {
    try {
      const games = await this.gameRepository.find();
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        games,
        message: GameMessages.GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({ where: { id } });

      if (!game) {
        throw new NotFoundException(GameMessages.GAME_NOT_FOUND(id));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game,
        message: GameMessages.GAME_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    updateGameDto: UpdateGameDto,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({ where: { id } });

      if (!game) {
        throw new NotFoundException(GameMessages.GAME_NOT_FOUND(id));
      }

      if (updateGameDto.name && updateGameDto.name !== game.name) {
        const existingGame = await this.gameRepository.findOne({
          where: { name: updateGameDto.name },
        });

        if (existingGame) {
          throw new ConflictException(GameMessages.GAME_ALREADY_EXISTS('name'));
        }
      }

      Object.assign(game, updateGameDto);
      const updatedGame = await this.gameRepository.save(game);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game: updatedGame,
        message: GameMessages.GAME_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({ where: { id } });

      if (!game) {
        throw new NotFoundException(GameMessages.GAME_NOT_FOUND(id));
      }

      await this.gameRepository.delete(id);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: GameMessages.GAME_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async activateGame(
    id: string,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({ where: { id } });

      if (!game) {
        throw new NotFoundException(GameMessages.GAME_NOT_FOUND(id));
      }

      if (game.isActive) {
        throw new ConflictException(GameMessages.GAME_ALREADY_ACTIVATED);
      }
      game.isActive = true;
      const updatedGame = await this.gameRepository.save(game);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game: updatedGame,
        message: GameMessages.GAME_ACTIVATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async deactivateGame(
    id: string,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const game = await this.gameRepository.findOne({ where: { id } });

      if (!game) {
        throw new NotFoundException(GameMessages.GAME_NOT_FOUND(id));
      }
      if (!game.isActive) {
        throw new ConflictException(GameMessages.GAME_ALREADY_DEACTIVATED);
      }
      game.isActive = false;
      const updatedGame = await this.gameRepository.save(game);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game: updatedGame,
        message: GameMessages.GAME_DEACTIVATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
