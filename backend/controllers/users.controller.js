const User = require('../models/User');
const UserGame = require('../models/UserGame');
const Reward = require('../models/Reward');
const ActiveGameAssignment = require('../models/ActiveGameAssignment');
const GamePlayTracking = require('../models/GamePlayTracking');
const ChosenAction = require('../models/ChosenAction');
const Shop = require('../models/Shop');
const Game = require('../models/Game');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { UserMessages } = require('../common/constants/messages.constants');
const mailService = require('../services/mail.service');

const create = async (req, res) => {
  try {
    const dto = req.body;
    if (dto.email) {
      dto.email = dto.email.trim().toLowerCase();
    }

    const existingUser = await User.findOne({ email: dto.email });

    if (!dto.shopId || !dto.rewardId) {
      return res.status(400).json({
        statusCode: 400,
        error: { message: 'Shop ID and Reward ID are required' },
      });
    }

    let chosenAction = null;
    chosenAction = await ChosenAction.findById(dto.actionId);

    if (!chosenAction) {
      return res.status(404).json({
        statusCode: 404,
        error: {
          message: `Chosen action with ID ${dto.actionId} not found`,
        },
      });
    }

    const reward = await Reward.findById(dto.rewardId).populate('shopId');

    if (!reward) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: 'Reward not found' },
      });
    }

    const activeGameAssignment = await ActiveGameAssignment.findOne({
      shopId: dto.shopId,
      isActive: true,
    }).populate('gameId');

    if (!activeGameAssignment) {
      return res.status(400).json({
        statusCode: 400,
        error: { message: 'No active game found for this shop' },
      });
    }

    const currentTime = new Date();
    let userToNotify;
    let isNewUser = false;

    if (!existingUser) {
      const newUser = await User.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        tel: dto.tel,
        agreeToPromotions: dto.agreeToPromotions,
        totalPlayedGames: 1,
      });

      userToNotify = newUser;
      isNewUser = true;

      await UserGame.create({
        userId: newUser.id,
        rewardId: dto.rewardId,
        activeGameAssignmentId: activeGameAssignment.id,
        gameId: activeGameAssignment.gameId,
        shopId: dto.shopId,
        nbPlayedTimes: 1,
        playCount: 1,
        lastPlayedAt: currentTime,
      });
    } else {
      const lastGameAtShop = await UserGame.findOne({
        userId: existingUser.id,
        shopId: dto.shopId,
      }).sort({ lastPlayedAt: -1 });

      if (lastGameAtShop) {
        const lastPlayedTime = new Date(lastGameAtShop.lastPlayedAt);
        const timeDifference = currentTime.getTime() - lastPlayedTime.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference < 24) {
          const remainingMs = 24 * 60 * 60 * 1000 - timeDifference;
          const nextPlayTime = new Date(
            lastPlayedTime.getTime() + 24 * 60 * 60 * 1000
          );

          return res.status(400).json({
            statusCode: HttpStatusCodes.BAD_REQUEST,
            error: {
              code: 'USER_COOLDOWN',
              message:
                'You can play again after 24 hours from your last game at this shop',
              timestamp: nextPlayTime.getTime(),
              remainingTime: remainingMs,
              userId: existingUser.id,
            },
          });
        }
      }

      const existingUserGame = await UserGame.findOne({
        userId: existingUser.id,
        shopId: dto.shopId,
        gameId: activeGameAssignment.gameId,
      });

      if (existingUserGame) {
        existingUserGame.nbPlayedTimes += 1;
        existingUserGame.playCount += 1;
        existingUserGame.lastPlayedAt = currentTime;
        existingUserGame.rewardId = dto.rewardId;
        existingUserGame.activeGameAssignmentId = activeGameAssignment.id;
        await existingUserGame.save();
      } else {
        await UserGame.create({
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
      userToNotify = await existingUser.save();
    }

    const shop = await Shop.findById(dto.shopId);
    const game = await Game.findById(activeGameAssignment.gameId);

    await GamePlayTracking.create({
      userId: userToNotify.id,
      shopId: shop.id,
      gameId: game.id,
      activeGameAssignmentId: activeGameAssignment.id,
      rewardId: reward.id,
      chosenActionId: chosenAction.id,
    });

    try {
      const validFromDate = new Date().toLocaleDateString();
      const validUntilDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString();
      const emailCode = `REWARD-${dto.rewardId}-${Date.now().toString().slice(-6)}`;

      await mailService.sendGiftEmail(
        `${userToNotify.firstName} ${userToNotify.lastName}`,
        reward.name,
        shop.name,
        userToNotify.email,
        validFromDate,
        validUntilDate,
        emailCode,
        reward.id,
        dto.shopId,
        userToNotify.id,
        dto.actionId
      );
    } catch (emailError) {
      console.error('Email sending failed');
    }

    return res
      .status(isNewUser ? HttpStatusCodes.CREATED : HttpStatusCodes.SUCCESS)
      .json(
        ApiResponse.success(
          isNewUser ? HttpStatusCodes.CREATED : HttpStatusCodes.SUCCESS,
          {
            user: userToNotify,
            userId: userToNotify.id,
            message: isNewUser
              ? 'User created successfully and reward email sent'
              : 'User game record updated successfully and reward email sent',
          }
        )
      );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { users }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }
    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { user }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        user,
        message: UserMessages.USER_UPDATED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }
    await User.findByIdAndDelete(id);
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: UserMessages.USER_DELETED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findUsersByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        statusCode: 400,
        error: { message: 'Date query parameter is required' },
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const users = await User.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { users }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  findUsersByDate,
};
