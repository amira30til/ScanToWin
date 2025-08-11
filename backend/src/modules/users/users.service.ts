import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMessages } from 'src/common/constants/messages.constants';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { ApiResponse } from 'src/common/utils/response.util';
import { HttpStatusCodes } from 'src/common/constants/http.constants';
import { handleServiceError } from 'src/common/utils/error-handler.util';
import { UserGame } from '../user-game/entities/user-game.entity';
import { Reward } from '../reward/entities/reward.entity';
import { ActiveGameAssignment } from '../active-game-assignment/entities/active-game-assignment.entity';
import { MailService } from '../mail/mail.service';
import { GamePlayTracking } from '../game-play-tracking/entities/game-play-tracking.entity';
import { ChosenAction } from '../chosen-action/entities/chosen-action.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserGame)
    private readonly userGameRepository: Repository<UserGame>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(ActiveGameAssignment)
    private readonly activeGameAssignmentRepository: Repository<ActiveGameAssignment>,
    private readonly mailService: MailService,
    @InjectRepository(GamePlayTracking)
    private readonly gamePlayTrackingRepository: Repository<GamePlayTracking>,

    @InjectRepository(ChosenAction)
    private readonly chosenActionRepository: Repository<ChosenAction>,
  ) {}

  async create(
    dto: CreateUserDto,
  ): Promise<ApiResponseInterface<User> | ErrorResponseInterface> {
    try {
      if (dto.email) {
        dto.email = dto.email.trim().toLowerCase();
      }

      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (!dto.shopId || !dto.rewardId) {
        throw new BadRequestException('Shop ID and Reward ID are required');
      }
      let chosenAction: ChosenAction | null = null;
      chosenAction = await this.chosenActionRepository.findOne({
        where: { id: dto.actionId },
      });

      if (!chosenAction) {
        throw new NotFoundException(
          `Chosen action with ID ${dto.actionId} not found`,
        );
      }

      const reward = await this.rewardRepository.findOne({
        where: { id: dto.rewardId },
        relations: ['shop'],
      });

      if (!reward) {
        throw new NotFoundException('Reward not found');
      }

      const activeGameAssignment =
        await this.activeGameAssignmentRepository.findOne({
          where: {
            shopId: dto.shopId,
            isActive: true,
          },
          relations: ['game'],
        });

      if (!activeGameAssignment) {
        throw new BadRequestException('No active game found for this shop');
      }

      const currentTime = new Date();
      let userToNotify: User;
      let isNewUser = false;

      if (!existingUser) {
        const newUser = this.userRepository.create({
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          tel: dto.tel,
          agreeToPromotions: dto.agreeToPromotions,
          totalPlayedGames: 1,
        });

        const savedUser = await this.userRepository.save(newUser);
        userToNotify = savedUser;
        isNewUser = true;

        await this.userGameRepository.save({
          userId: savedUser.id,
          rewardId: dto.rewardId,
          activeGameAssignmentId: activeGameAssignment.id,
          gameId: activeGameAssignment.gameId,
          shopId: dto.shopId,
          nbPlayedTimes: 1,
          playCount: 1,
          lastPlayedAt: currentTime,
        });
      } else {
        const lastGameAtShop = await this.userGameRepository.findOne({
          where: {
            userId: existingUser.id,
            shopId: dto.shopId,
          },
          order: { lastPlayedAt: 'DESC' },
        });

        if (lastGameAtShop) {
          const lastPlayedTime = new Date(lastGameAtShop.lastPlayedAt);
          const timeDifference =
            currentTime.getTime() - lastPlayedTime.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);

          if (hoursDifference < 24) {
            const remainingMs = 24 * 60 * 60 * 1000 - timeDifference;
            const nextPlayTime = new Date(
              lastPlayedTime.getTime() + 24 * 60 * 60 * 1000,
            );

            return {
              statusCode: HttpStatusCodes.BAD_REQUEST,
              error: {
                code: 'USER_COOLDOWN',
                message:
                  'You can play again after 24 hours from your last game at this shop',
                timestamp: nextPlayTime.getTime(),
                remainingTime: remainingMs,
                userId: existingUser.id,
              },
            };
          }
        }

        const existingUserGame = await this.userGameRepository.findOne({
          where: {
            userId: existingUser.id,
            shopId: dto.shopId,
            gameId: activeGameAssignment.gameId,
          },
        });

        if (existingUserGame) {
          existingUserGame.nbPlayedTimes += 1;
          existingUserGame.playCount += 1;
          existingUserGame.lastPlayedAt = currentTime;
          existingUserGame.rewardId = dto.rewardId;
          existingUserGame.activeGameAssignmentId = activeGameAssignment.id;
          await this.userGameRepository.save(existingUserGame);
        } else {
          await this.userGameRepository.save({
            userId: existingUser.id,
            rewardId: dto.rewardId,
            activeGameAssignmentId: activeGameAssignment.id,
            gameId: activeGameAssignment.gameId,
            shopId: dto.shopId,
            nbPlayedTimes: 1,
            playCount: 1,
            lastPlayedAt: currentTime,
          });
        }

        existingUser.totalPlayedGames += 1;
        userToNotify = await this.userRepository.save(existingUser);
      }

      // ✅ Save game play tracking log only once using userToNotify
      await this.gamePlayTrackingRepository.save({
        user: userToNotify,
        shop: reward.shop,
        game: activeGameAssignment.game,
        activeGameAssignment,
        reward,
        chosenAction,
      });

      try {
        const validFromDate = new Date().toLocaleDateString();
        const validUntilDate = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString();

        await this.mailService.sendGiftEmail(
          `${userToNotify.firstName} ${userToNotify.lastName}`,
          reward.name,
          reward.shop.name,
          userToNotify.email,
          validFromDate,
          validUntilDate,
          reward.id,
          dto.shopId,
          userToNotify.id,
          dto.actionId,
        );
      } catch (emailError) {
        console.error('Email sending failed', emailError);
      }

      return ApiResponse.success(
        isNewUser ? HttpStatusCodes.CREATED : HttpStatusCodes.SUCCESS,
        {
          user: userToNotify,
          userId: userToNotify.id,
          message: isNewUser
            ? 'User created successfully and reward email sent'
            : 'User game record updated successfully and reward email sent',
        },
      );
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findAll(): Promise<
    ApiResponseInterface<User[]> | ErrorResponseInterface
  > {
    try {
      const users = await this.userRepository.find();
      return ApiResponse.success(HttpStatusCodes.SUCCESS, { users });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<ApiResponseInterface<User> | ErrorResponseInterface> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }
      return ApiResponse.success(HttpStatusCodes.SUCCESS, { user });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<ApiResponseInterface<User> | ErrorResponseInterface> {
    try {
      const user = await this.userRepository.preload({ id, ...dto });
      if (!user) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }
      const saved = await this.userRepository.save(user);
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        user: saved,
        message: UserMessages.USER_UPDATED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async remove(
    id: string,
  ): Promise<ApiResponseInterface<null> | ErrorResponseInterface> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND(id));
      }
      await this.userRepository.remove(user);
      return ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: UserMessages.USER_DELETED,
      });
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async findUsersByDate(
    date: string,
  ): Promise<ApiResponseInterface<User[]> | ErrorResponseInterface> {
    try {
      if (!date) {
        throw new BadRequestException('Date query parameter is required');
      }

      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const users = await this.userRepository.find({
        where: {
          createdAt: Between(startOfDay, endOfDay),
        },
      });

      return ApiResponse.success(HttpStatusCodes.SUCCESS, { users });
    } catch (error) {
      return handleServiceError(error);
    }
  }
}
