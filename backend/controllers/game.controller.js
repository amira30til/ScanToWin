const Game = require('../models/Game');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { GameMessages } = require('../common/constants/messages.constants');
const cloudinaryService = require('../services/cloudinary.service');

const create = async (req, res) => {
  try {
    const createGameDto = req.body;
    const file = req.file;

    const existingGame = await Game.findOne({ name: createGameDto.name });
    if (existingGame) {
      return res.status(409).json({
        statusCode: 409,
        error: { message: GameMessages.GAME_ALREADY_EXISTS('name') },
      });
    }

    let pictureUrl = undefined;
    if (file) {
      try {
        const uploadResult = await cloudinaryService.uploadImageToCloudinary(file);
        pictureUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Game picture upload failed:', uploadError);
        pictureUrl = undefined;
      }
    }

    const newGame = await Game.create({
      ...createGameDto,
      status: 'ACTIVE',
      pictureUrl: pictureUrl,
    });

    return res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.success(HttpStatusCodes.CREATED, {
        game: newGame,
        message: GameMessages.GAME_CREATED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const games = await Game.find({ status: 'ACTIVE' });
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        games,
        message: GameMessages.GAMES_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const getGamesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const games = await Game.find({ status });
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        games,
        message: GameMessages.GAMES_FETCHED,
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
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: GameMessages.GAME_NOT_FOUND(id) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game,
        message: GameMessages.GAME_FETCHED,
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
    const updateGameDto = req.body;
    const file = req.file;

    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: GameMessages.GAME_NOT_FOUND(id) },
      });
    }

    if (updateGameDto.name && updateGameDto.name !== game.name) {
      const existingGame = await Game.findOne({ name: updateGameDto.name });
      if (existingGame) {
        return res.status(409).json({
          statusCode: 409,
          error: { message: GameMessages.GAME_ALREADY_EXISTS('name') },
        });
      }
    }

    if (file) {
      const result = await cloudinaryService.uploadImageToCloudinary(file);
      updateGameDto.pictureUrl = result.url;
    }

    Object.assign(game, updateGameDto);
    const updatedGame = await game.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        game: updatedGame,
        message: GameMessages.GAME_UPDATED,
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
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: GameMessages.GAME_NOT_FOUND(id) },
      });
    }

    await Game.findByIdAndDelete(id);
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: GameMessages.GAME_DELETED,
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
  getGamesByStatus,
  findOne,
  update,
  remove,
};
