import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGame } from './entities/user-game.entity';
import { CreateUserGameDto } from './dto/create-user-game.dto';
import { UpdateUserGameDto } from './dto/update-user-game.dto';
import { User } from '../users/entities/user.entity';
import { ChosenGame } from '../chosen-game/entities/chosen-game.entity';
import { UserGameMessages } from 'src/common/constants/messages.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(UserGame)
    private readonly userGameRepository: Repository<UserGame>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChosenGame)
    private readonly chosenGameRepository: Repository<ChosenGame>,
  ) {}

  async create(
    createDto: CreateUserGameDto,
  ): Promise<ApiResponseInterface<UserGame> | ErrorResponseInterface> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({
        where: { id: createDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${createDto.userId} not found`,
        );
      }

      // Check if chosen game exists
      const chosenGame = await this.chosenGameRepository.findOne({
        where: { id: createDto.gameId },
      });
      if (!chosenGame) {
        throw new NotFoundException(
          `Chosen game with ID ${createDto.gameId} not found`,
        );
      }

      // Check if user-game combination already exists
      const existingUserGame = await this.userGameRepository.findOne({
        where: {
          user: { id: createDto.userId },
          game: { id: createDto.gameId },
        },
      });

      if (existingUserGame) {
        throw new ConflictException(UserGameMessages.USER_GAME_ALREADY_EXISTS);
      }

      const newUserGame = this.userGameRepository.create({
        nbPlayedTimes: createDto.nbPlayedTimes || 0,
        user,
        game: chosenGame,
      });

      const savedUserGame = await this.userGameRepository.save(newUserGame);

      // Update user's total played games count
      await this.userRepository.increment(
        { id: createDto.userId },
        'totalPlayedGames',
        1,
      );

      return ApiResponse.success(HttpStatusCodes.CREATED, {
        userGame: savedUserGame,
        message: UserGameMessages.USER_GAME_CREATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<UserGame[]> | ErrorResponseInterface
  > {
    try {
      const userGames = await this.userGameRepository.find({
        relations: ['user', 'game'],
      });
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: UserGameMessages.USER_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: number,
  ): Promise<ApiResponseInterface<UserGame> | ErrorResponseInterface> {
    try {
      const userGame = await this.userGameRepository.findOne({
        where: { id },
        relations: ['user', 'game'],
      });

      if (!userGame) {
        throw new NotFoundException(UserGameMessages.USER_GAME_NOT_FOUND(id));
      }

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGame,
        message: UserGameMessages.USER_GAME_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: number,
    updateDto: UpdateUserGameDto,
  ): Promise<ApiResponseInterface<UserGame> | ErrorResponseInterface> {
    try {
      const userGame = await this.userGameRepository.findOne({
        where: { id },
        relations: ['user', 'game'],
      });

      if (!userGame) {
        throw new NotFoundException(UserGameMessages.USER_GAME_NOT_FOUND(id));
      }

      // Check if user exists if being updated
      let user: User = userGame.user;
      if (updateDto.userId && updateDto.userId !== userGame.user.id) {
        const foundUser = await this.userRepository.findOne({
          where: { id: updateDto.userId },
        });
        if (!foundUser) {
          throw new NotFoundException(
            `User with ID ${updateDto.userId} not found`,
          );
        }
        user = foundUser;
      }

      // Check if chosen game exists if being updated
      let game: ChosenGame = userGame.game;
      if (updateDto.gameId && updateDto.gameId !== userGame.game.id) {
        const foundGame = await this.chosenGameRepository.findOne({
          where: { id: updateDto.gameId },
        });
        if (!foundGame) {
          throw new NotFoundException(
            `Chosen game with ID ${updateDto.gameId} not found`,
          );
        }
        game = foundGame;
      }

      // Check if the new user-game combination already exists
      if (
        (updateDto.userId && updateDto.userId !== userGame.user.id) ||
        (updateDto.gameId && updateDto.gameId !== userGame.game.id)
      ) {
        const existingUserGame = await this.userGameRepository.findOne({
          where: {
            user: { id: updateDto.userId || userGame.user.id },
            game: { id: updateDto.gameId || userGame.game.id },
          },
        });

        if (existingUserGame && existingUserGame.id !== id) {
          throw new ConflictException(
            UserGameMessages.USER_GAME_ALREADY_EXISTS,
          );
        }
      }

      Object.assign(userGame, {
        nbPlayedTimes: updateDto.nbPlayedTimes ?? userGame.nbPlayedTimes,
        user,
        game,
      });

      const updatedUserGame = await this.userGameRepository.save(userGame);
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGame: updatedUserGame,
        message: UserGameMessages.USER_GAME_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: number,
  ): Promise<ApiResponseInterface<UserGame> | ErrorResponseInterface> {
    try {
      const userGame = await this.userGameRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!userGame) {
        throw new NotFoundException(UserGameMessages.USER_GAME_NOT_FOUND(id));
      }

      // Decrement user's total played games count before deletion
      await this.userRepository.decrement(
        { id: userGame.user.id },
        'totalPlayedGames',
        1,
      );

      await this.userGameRepository.delete(id);
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: UserGameMessages.USER_GAME_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async incrementPlayCount(
    id: number,
  ): Promise<ApiResponseInterface<UserGame> | ErrorResponseInterface> {
    try {
      const userGame = await this.userGameRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!userGame) {
        throw new NotFoundException(UserGameMessages.USER_GAME_NOT_FOUND(id));
      }

      userGame.nbPlayedTimes += 1;
      const updatedUserGame = await this.userGameRepository.save(userGame);

      // Also increment user's total played games
      await this.userRepository.increment(
        { id: userGame.user.id },
        'totalPlayedGames',
        1,
      );

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGame: updatedUserGame,
        message: UserGameMessages.PLAY_COUNT_INCREMENTED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByUser(
    userId: number,
  ): Promise<ApiResponseInterface<UserGame[]> | ErrorResponseInterface> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const userGames = await this.userGameRepository.find({
        where: { user: { id: userId } },
        relations: ['game', 'game.game'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: UserGameMessages.USER_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findByChosenGame(
    gameId: number,
  ): Promise<ApiResponseInterface<UserGame[]> | ErrorResponseInterface> {
    try {
      const chosenGame = await this.chosenGameRepository.findOne({
        where: { id: gameId },
      });
      if (!chosenGame) {
        throw new NotFoundException(`Chosen game with ID ${gameId} not found`);
      }

      const userGames = await this.userGameRepository.find({
        where: { game: { id: gameId } },
        relations: ['user'],
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: UserGameMessages.USER_GAMES_FETCHED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
