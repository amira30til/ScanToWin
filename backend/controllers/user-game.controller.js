const UserGame = require('../models/UserGame');
const User = require('../models/User');
const ActiveGameAssignment = require('../models/ActiveGameAssignment');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { UserGameMessages } = require('../common/constants/messages.constants');

const create = async (req, res) => {
  try {
    const createDto = req.body;
    const user = await User.findById(createDto.userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `User with ID ${createDto.userId} not found` },
      });
    }

    const chosenGame = await ActiveGameAssignment.findById(createDto.gameId);
    if (!chosenGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `Chosen game with ID ${createDto.gameId} not found` },
      });
    }

    const existingUserGame = await UserGame.findOne({
      userId: createDto.userId,
      activeGameAssignmentId: createDto.gameId,
    });

    if (existingUserGame) {
      return res.status(409).json({
        statusCode: 409,
        error: { message: UserGameMessages.USER_GAME_ALREADY_EXISTS },
      });
    }

    const newUserGame = await UserGame.create({
      nbPlayedTimes: createDto.nbPlayedTimes || 0,
      userId: createDto.userId,
      activeGameAssignmentId: createDto.gameId,
    });

    await User.findByIdAndUpdate(createDto.userId, {
      $inc: { totalPlayedGames: 1 },
    });

    return res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.success(HttpStatusCodes.CREATED, {
        userGame: newUserGame,
        message: UserGameMessages.USER_GAME_CREATED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const userGames = await UserGame.find()
      .populate('userId')
      .populate('gameId');
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: UserGameMessages.USER_GAMES_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const userGame = await UserGame.findById(id)
      .populate('userId')
      .populate('gameId');

    if (!userGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserGameMessages.USER_GAME_NOT_FOUND(id) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGame,
        message: UserGameMessages.USER_GAME_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateDto = req.body;
    const userGame = await UserGame.findById(id);

    if (!userGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserGameMessages.USER_GAME_NOT_FOUND(id) },
      });
    }

    Object.assign(userGame, updateDto);
    const updatedUserGame = await userGame.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGame: updatedUserGame,
        message: UserGameMessages.USER_GAME_UPDATED,
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
    const userGame = await UserGame.findById(id);

    if (!userGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserGameMessages.USER_GAME_NOT_FOUND(id) },
      });
    }

    await User.findByIdAndUpdate(userGame.userId, {
      $inc: { totalPlayedGames: -1 },
    });

    await UserGame.findByIdAndDelete(id);
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: UserGameMessages.USER_GAME_DELETED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const incrementPlayCount = async (req, res) => {
  try {
    const { id } = req.params;
    const userGame = await UserGame.findById(id);

    if (!userGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserGameMessages.USER_GAME_NOT_FOUND(id) },
      });
    }

    userGame.nbPlayedTimes += 1;
    const updatedUserGame = await userGame.save();

    await User.findByIdAndUpdate(userGame.userId, {
      $inc: { totalPlayedGames: 1 },
    });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGame: updatedUserGame,
        message: UserGameMessages.PLAY_COUNT_INCREMENTED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `User with ID ${userId} not found` },
      });
    }

    const userGames = await UserGame.find({ userId })
      .populate('gameId')
      .populate('activeGameAssignmentId');

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: UserGameMessages.USER_GAMES_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findByChosenGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const chosenGame = await ActiveGameAssignment.findById(gameId);
    if (!chosenGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `Chosen game with ID ${gameId} not found` },
      });
    }

    const userGames = await UserGame.find({
      activeGameAssignmentId: gameId,
    }).populate('userId');

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        userGames,
        message: UserGameMessages.USER_GAMES_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const verifyUserCooldown = async (req, res) => {
  try {
    const { userId, shopId } = req.params;
    const lastGameAtShop = await UserGame.findOne({
      userId,
      shopId,
    }).sort({ lastPlayedAt: -1 });

    if (!lastGameAtShop) {
      return res.json({ userId });
    }

    const currentTime = new Date();
    const lastPlayedTime = new Date(lastGameAtShop.lastPlayedAt);
    const timeDifference = currentTime.getTime() - lastPlayedTime.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    const nextPlayTime = new Date(
      lastPlayedTime.getTime() + 24 * 60 * 60 * 1000
    );

    if (hoursDifference < 24) {
      return res.json({
        userId,
        code: 'COOLDOWN',
        timestamp: nextPlayTime.getTime(),
      });
    }

    return res.json({ userId });
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const getUsersByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const hasPagination = page !== undefined && limit !== undefined;
    const skip = hasPagination ? (page - 1) * limit : 0;

    const userGames = await UserGame.find({ shopId })
      .populate('userId')
      .populate('gameId')
      .skip(hasPagination ? skip : 0)
      .limit(hasPagination ? limit : 0)
      .sort({ 'userId.firstName': 1 });

    const usersMap = new Map();
    userGames.forEach((ug) => {
      const userId = ug.userId._id.toString();
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          userId: ug.userId._id,
          firstName: ug.userId.firstName,
          lastName: ug.userId.lastName,
          email: ug.userId.email,
          tel: ug.userId.tel,
          lastPlayedAt: ug.lastPlayedAt,
          totalPlayCount: 0,
          favoriteGameId: null,
        });
      }
      const user = usersMap.get(userId);
      user.totalPlayCount += ug.playCount || 0;
      if (
        !user.lastPlayedAt ||
        new Date(ug.lastPlayedAt) > new Date(user.lastPlayedAt)
      ) {
        user.lastPlayedAt = ug.lastPlayedAt;
      }
    });

    const users = Array.from(usersMap.values());
    const total = hasPagination
      ? await UserGame.distinct('userId', { shopId }).then((ids) => ids.length)
      : users.length;

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        users,
        total,
        message: `Users for shop ${shopId} fetched successfully`,
      })
    );
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
  incrementPlayCount,
  findByUser,
  findByChosenGame,
  verifyUserCooldown,
  getUsersByShopId,
};
