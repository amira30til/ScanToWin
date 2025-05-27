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
import { GameStatus } from './enums/game-status.enums';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createGameDto: CreateGameDto,
    file?: Express.Multer.File,
  ): Promise<ApiResponseInterface<Game> | ErrorResponseInterface> {
    try {
      const existingGame = await this.gameRepository.findOne({
        where: { name: createGameDto.name },
      });
      if (existingGame) {
        throw new ConflictException(GameMessages.GAME_ALREADY_EXISTS('name'));
      }

      let pictureUrl: string | undefined = undefined;
      if (file) {
        try {
          const uploadResult =
            await this.cloudinaryService.uploadImageToCloudinary(file);
          pictureUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Game picture upload failed:', uploadError);
          pictureUrl = undefined;
        }
      }

      // Create new game
      const newGame = this.gameRepository.create({
        ...createGameDto,
        status: GameStatus.ACTIVE,
        pictureUrl: pictureUrl,
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
      const games = await this.gameRepository.find({
        where: { status: GameStatus.ACTIVE },
      });
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
    file?: Express.Multer.File,
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
      if (file) {
        const result =
          await this.cloudinaryService.uploadImageToCloudinary(file);
        updateGameDto.pictureUrl = result.url;
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

      if (game.status == GameStatus.ACTIVE) {
        throw new ConflictException(GameMessages.GAME_ALREADY_ACTIVATED);
      }
      game.status = GameStatus.ACTIVE;
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
      if (game.status !== GameStatus.ACTIVE) {
        throw new ConflictException(GameMessages.GAME_ALREADY_DEACTIVATED);
      }
      game.status = GameStatus.INACTIVE;
      const updatedGame = await this.gameRepository.save(game);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game: updatedGame,
        message: GameMessages.GAME_DEACTIVATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async getGamesByStatus(
    status: GameStatus,
  ): Promise<ApiResponseInterface<Game[]> | ErrorResponseInterface> {
    try {
      const games = await this.gameRepository.find({
        where: { status },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: games,
        message: `${games.length} game(s) with status ${status} fetched successfully.`,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
