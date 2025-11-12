const ActiveGameAssignment = require('../models/ActiveGameAssignment');
const Game = require('../models/Game');
const Shop = require('../models/Shop');
const Admin = require('../models/Admin');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { ChosenGameMessages, GameMessages, ShopMessages } = require('../common/constants/messages.constants');

const setActiveGameForShop = async (req, res) => {
  try {
    const { shopId, gameId, adminId } = req.params;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(shopId) },
      });
    }

    const game = await Game.findOne({ _id: gameId, status: 'ACTIVE' });
    if (!game) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: GameMessages.ACTIVE_GAME_NOT_FOUND(gameId) },
      });
    }

    const activeGame = await ActiveGameAssignment.findOne({ shopId });

    if (activeGame) {
      activeGame.gameId = gameId;
      activeGame.adminId = adminId;
      const updatedGame = await activeGame.save();

      return res.json(
        ApiResponse.success(HttpStatusCodes.SUCCESS, {
          data: updatedGame,
          message: GameMessages.ACTIVE_GAME_UPDATED,
        })
      );
    } else {
      const newActiveGame = await ActiveGameAssignment.create({
        shopId,
        gameId,
        adminId,
      });

      return res.json(
        ApiResponse.success(HttpStatusCodes.SUCCESS, {
          data: newActiveGame,
          message: GameMessages.ACTIVE_GAME_ASSIGNED,
        })
      );
    }
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const getActiveGameForShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(shopId) },
      });
    }

    const activeGame = await ActiveGameAssignment.findOne({
      shopId,
      isActive: true,
    }).populate('gameId');

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: activeGame || [],
        message: GameMessages.ACTIVE_GAME_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const activeGame = await ActiveGameAssignment.find()
      .populate('adminId')
      .populate('gameId')
      .populate('shopId');
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGame,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
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
    const activeGame = await ActiveGameAssignment.findById(id)
      .populate('adminId')
      .populate('gameId')
      .populate('shopId');

    if (!activeGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGame,
        message: ChosenGameMessages.CHOSEN_GAME_FETCHED,
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
    const chosenGame = await ActiveGameAssignment.findById(id);

    if (!chosenGame) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ChosenGameMessages.CHOSEN_GAME_NOT_FOUND(id) },
      });
    }

    await ActiveGameAssignment.findByIdAndDelete(id);
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: ChosenGameMessages.CHOSEN_GAME_DELETED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `Admin with ID ${adminId} not found` },
      });
    }

    const activeGame = await ActiveGameAssignment.find({ adminId })
      .populate('gameId')
      .populate('shopId');

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGame,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `Game with ID ${gameId} not found` },
      });
    }

    const activeGames = await ActiveGameAssignment.find({ gameId })
      .populate('adminId')
      .populate('shopId');

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        activeGames,
        message: ChosenGameMessages.CHOSEN_GAMES_FETCHED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const generateShopQrIdentifier = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(shopId) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        data: shopId,
        message: ShopMessages.QR_CODE_GENERATED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

module.exports = {
  setActiveGameForShop,
  getActiveGameForShop,
  findAll,
  findOne,
  remove,
  findByAdmin,
  findByGame,
  generateShopQrIdentifier,
};
