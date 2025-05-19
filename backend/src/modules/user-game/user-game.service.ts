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
import {
  UserGameMessages,
  UserMessages,
} from 'src/common/constants/messages.constants';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { ActiveGameAssignmentService } from '../active-game-assignment/active-game-assignment.service';
import { differenceInHours } from 'date-fns';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(UserGame)
    private readonly userGameRepository: Repository<UserGame>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ActiveGameAssignment)
    private readonly activeGameAssignmentRepository: Repository<ActiveGameAssignment>,
    private readonly activeGameAssignmentService: ActiveGameAssignmentService,
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
      const chosenGame = await this.activeGameAssignmentRepository.findOne({
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
          activeGameAssignment: { id: createDto.gameId },
        },
      });

      if (existingUserGame) {
        throw new ConflictException(UserGameMessages.USER_GAME_ALREADY_EXISTS);
      }

      const newUserGame = this.userGameRepository.create({
        nbPlayedTimes: createDto.nbPlayedTimes || 0,
        user,
        activeGameAssignment: chosenGame,
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
    id: string,
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
    id: string,
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
      let activeGameAssignment: ActiveGameAssignment =
        userGame.activeGameAssignment;
      if (
        updateDto.gameId &&
        updateDto.gameId !== userGame.activeGameAssignment.id
      ) {
        const foundGame = await this.activeGameAssignmentRepository.findOne({
          where: { id: updateDto.gameId },
        });
        if (!foundGame) {
          throw new NotFoundException(
            `Chosen game with ID ${updateDto.gameId} not found`,
          );
        }
        activeGameAssignment = foundGame;
      }

      // Check if the new user-game combination already exists
      if (
        (updateDto.userId && updateDto.userId !== userGame.user.id) ||
        (updateDto.gameId &&
          updateDto.gameId !== userGame.activeGameAssignment.id)
      ) {
        const existingUserGame = await this.userGameRepository.findOne({
          where: {
            user: { id: updateDto.userId || userGame.user.id },
            activeGameAssignment: {
              id: updateDto.gameId || userGame.activeGameAssignment.id,
            },
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
        activeGameAssignment,
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
    id: string,
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
    id: string,
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
    userId: string,
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
    gameId: string,
  ): Promise<ApiResponseInterface<UserGame[]> | ErrorResponseInterface> {
    try {
      const chosenGame = await this.activeGameAssignmentRepository.findOne({
        where: { id: gameId },
      });
      if (!chosenGame) {
        throw new NotFoundException(`Chosen game with ID ${gameId} not found`);
      }

      const userGames = await this.userGameRepository.find({
        where: { activeGameAssignment: { id: gameId } },
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
  /////////////////////////////////////////////////////////

  async registerUserPlay(
    userId: string,
    qrCodeIdentifier: string,
  ): Promise<UserGame> {
    // Validate the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get the shop and active game from QR code
    const response =
      await this.activeGameAssignmentService.getShopByQrIdentifier(
        qrCodeIdentifier,
      );

    if ('error' in response) {
      throw new NotFoundException(response.error);
    }

    const { shop, activeGame } = response.data;

    // Check if user has played this game at this shop before
    let userPlay = await this.userGameRepository.findOne({
      where: {
        userId,
        activeGameAssignmentId: activeGame.id,
      },
    });

    // If user has played before, check cooldown
    if (userPlay) {
      const hoursSinceLastPlay = differenceInHours(
        new Date(),
        userPlay.lastPlayedAt,
      );

      // Enforce 24-hour cooldown
      if (hoursSinceLastPlay < 24) {
        const hoursRemaining = 24 - hoursSinceLastPlay;
        throw new ConflictException(
          `You can play this game again in ${Math.ceil(hoursRemaining)} hours`,
        );
      }

      // Update play count and timestamp
      userPlay.playCount += 1;
      userPlay.lastPlayedAt = new Date();
    } else {
      // Create new user play record
      userPlay = this.userGameRepository.create({
        userId,
        activeGameAssignmentId: activeGame.id,
        playCount: 1,
        lastPlayedAt: new Date(),
      });
    }

    return this.userGameRepository.save(userPlay);
  }

  async processQrGamePlay(qrCodeIdentifier: string, userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(userId));
      }

      const response =
        await this.activeGameAssignmentService.getShopByQrIdentifier(
          qrCodeIdentifier,
        );

      if ('error' in response) {
        throw new NotFoundException(response.error);
      }

      const { shop, activeGame } = response.data;

      const existingUserGame = await this.userGameRepository.findOne({
        where: {
          userId: user.id,
          activeGameAssignmentId: activeGame.id,
        },
      });

      if (existingUserGame) {
        const lastPlayedAt = new Date(existingUserGame.lastPlayedAt);
        const currentTime = new Date();
        const hoursSinceLastPlay =
          (currentTime.getTime() - lastPlayedAt.getTime()) / (1000 * 60 * 60);

        //TODO:
        //  24hour playing condition
        //or can we handle this in the front better ??
        if (hoursSinceLastPlay < 24) {
          const hoursRemaining = Math.ceil(24 - hoursSinceLastPlay);
          throw new ConflictException(
            `You need to wait ${hoursRemaining} more hour(s) before playing this game again`,
          );
        }

        existingUserGame.playCount += 1;
        existingUserGame.lastPlayedAt = currentTime;
        const updatedUserGame =
          await this.userGameRepository.save(existingUserGame);

        return ApiResponse.success(HttpStatusCodes.SUCCESS, {
          userGame: updatedUserGame,
          game: activeGame.game,
          message: 'Game play recorded successfully',
        });
      } else {
        const newUserGame = this.userGameRepository.create({
          user,
          userId: user.id,
          activeGameAssignment: activeGame,
          activeGameAssignmentId: activeGame.id,
          gameId: activeGame.gameId,
          playCount: 1,
          lastPlayedAt: new Date(),
        });

        const savedUserGame = await this.userGameRepository.save(newUserGame);

        user.totalPlayedGames = (user.totalPlayedGames || 0) + 1;
        await this.userRepository.save(user);

        return ApiResponse.success(HttpStatusCodes.SUCCESS, {
          userGame: savedUserGame,
          game: activeGame.game,
          message: 'First game play recorded successfully',
        });
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async getUserPlayHistoryForShop(userId: number, shopId: number) {
    try {
      const userGames = await this.userGameRepository
        .createQueryBuilder('userGame')
        .innerJoinAndSelect('userGame.activeGameAssignment', 'assignment')
        .innerJoinAndSelect('assignment.game', 'game')
        .where('userGame.userId = :userId', { userId })
        .andWhere('assignment.shopId = :shopId', { shopId })
        .getMany();

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: 'User play history fetched successfully',
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async canUserPlay(userId: string, qrCodeIdentifier: string) {
    try {
      const response =
        await this.activeGameAssignmentService.getShopByQrIdentifier(
          qrCodeIdentifier,
        );

      if ('error' in response) {
        throw new NotFoundException(response.error);
      }

      const { shop, activeGame } = response.data;

      const existingUserGame = await this.userGameRepository.findOne({
        where: {
          userId,
          activeGameAssignmentId: activeGame.id,
        },
      });

      if (!existingUserGame) {
        return ApiResponse.success(HttpStatusCodes.SUCCESS, {
          canPlay: true,
          message: 'User can play this game',
        });
      }

      const lastPlayedAt = new Date(existingUserGame.lastPlayedAt);
      const currentTime = new Date();
      const hoursSinceLastPlay =
        (currentTime.getTime() - lastPlayedAt.getTime()) / (1000 * 60 * 60);

      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        canPlay: hoursSinceLastPlay >= 24,
        hoursRemaining:
          hoursSinceLastPlay < 24 ? Math.ceil(24 - hoursSinceLastPlay) : 0,
        message:
          hoursSinceLastPlay >= 24
            ? 'User can play this game'
            : 'User must wait before playing again',
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
