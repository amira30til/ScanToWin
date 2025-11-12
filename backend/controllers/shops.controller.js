const Shop = require('../models/Shop');
const Admin = require('../models/Admin');
const UserGame = require('../models/UserGame');
const ChosenAction = require('../models/ChosenAction');
const RewardRedemption = require('../models/RewardRedemption');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { ShopMessages, UserMessages, ChosenActionMessages } = require('../common/constants/messages.constants');
const cloudinaryService = require('../services/cloudinary.service');

const create = async (req, res) => {
  try {
    const { adminId } = req.params;
    const dto = req.body;
    const logo = req.file;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(adminId) },
      });
    }

    const shopExists = await Shop.findOne({
      name: dto.name,
      adminId: adminId,
    });
    if (shopExists) {
      return res.status(409).json({
        statusCode: 409,
        error: { message: ShopMessages.SHOP_ALREADY_EXISTS('name') },
      });
    }

    let logoUrl = undefined;
    if (logo) {
      try {
        const uploadResult = await cloudinaryService.uploadImageToCloudinary(logo);
        logoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError);
        logoUrl = undefined;
      }
    }

    const newShop = await Shop.create({
      ...dto,
      adminId: adminId,
      status: 'ACTIVE',
      logo: logoUrl,
    });

    return res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.success(HttpStatusCodes.CREATED, { shop: newShop })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shops = await Shop.find({ status: 'ACTIVE' })
      .populate('adminId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Shop.countDocuments({ status: 'ACTIVE' });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAllByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(adminId) },
      });
    }

    const shops = await Shop.find({
      adminId: adminId,
      status: 'ACTIVE',
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Shop.countDocuments({
      adminId: adminId,
      status: 'ACTIVE',
    });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
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
    const shop = await Shop.findOne({ _id: id, status: 'ACTIVE' }).populate('adminId');

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(id) },
      });
    }

    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { shop }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findOneByAdmin = async (req, res) => {
  try {
    const { id, adminId } = req.params;
    const shop = await Shop.findOne({
      _id: id,
      adminId: adminId,
      status: 'ACTIVE',
    });

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND_FOR_ADMIN(id, adminId) },
      });
    }

    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { shop }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateShopDto = req.body;
    const logo = req.file;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(id) },
      });
    }

    if (updateShopDto.name && updateShopDto.name !== shop.name) {
      const shopExists = await Shop.findOne({
        name: updateShopDto.name,
        adminId: shop.adminId,
      });

      if (shopExists) {
        return res.status(409).json({
          statusCode: 409,
          error: { message: ShopMessages.SHOP_ALREADY_EXISTS('name') },
        });
      }
    }

    if (logo) {
      const result = await cloudinaryService.uploadImageToCloudinary(logo);
      updateShopDto.logo = result.url;
    }

    await Shop.findByIdAndUpdate(id, updateShopDto);
    const updatedShop = await Shop.findById(id).populate('adminId');

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, { shop: updatedShop })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const updateByAdmin = async (req, res) => {
  try {
    const { id, adminId } = req.params;
    const updateShopDto = req.body;
    const file = req.file;

    const shop = await Shop.findOne({
      _id: id,
      adminId: adminId,
    });

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND_FOR_ADMIN(id, adminId) },
      });
    }

    if (updateShopDto.name && updateShopDto.name !== shop.name) {
      const shopExists = await Shop.findOne({
        name: updateShopDto.name,
        adminId: adminId,
        _id: { $ne: id },
      });

      if (shopExists) {
        return res.status(409).json({
          statusCode: 409,
          error: { message: ShopMessages.SHOP_ALREADY_EXISTS('name') },
        });
      }
    }

    if (file) {
      const result = await cloudinaryService.uploadImageToCloudinary(file);
      updateShopDto.logo = result.url;
    }

    await Shop.findByIdAndUpdate(id, updateShopDto);
    const updatedShop = await Shop.findById(id);

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, { shop: updatedShop })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findOne({ _id: id, status: 'ACTIVE' });

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(id) },
      });
    }

    await Shop.findByIdAndDelete(id);

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: ShopMessages.SHOP_DELETE_SUCCESS(id),
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const removeByAdmin = async (req, res) => {
  try {
    const { id, adminId } = req.params;
    const shop = await Shop.findOne({ _id: id, adminId });

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(id) },
      });
    }

    shop.status = 'ARCHIVED';
    shop.adminId = null;
    await shop.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: `Shop with ID ${id} has been archived`,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(id) },
      });
    }

    shop.status = status;
    const updatedShop = await shop.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, { shop: updatedShop })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const updateStatusByAdmin = async (req, res) => {
  try {
    const { id, adminId } = req.params;
    const { status } = req.query;

    const shop = await Shop.findOne({
      _id: id,
      adminId: adminId,
    });

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND_FOR_ADMIN(id, adminId) },
      });
    }

    shop.status = status;
    const updatedShop = await shop.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, { shop: updatedShop })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const getShopsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shops = await Shop.find({ status })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Shop.countDocuments({ status });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const getShopsByStatusAndAdmin = async (req, res) => {
  try {
    const { status, adminId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(adminId) },
      });
    }

    const shops = await Shop.find({ adminId, status })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Shop.countDocuments({ adminId, status });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        shops,
        total,
        page,
        limit,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const verifyGameCodePin = async (req, res) => {
  try {
    const dto = req.body;
    const shop = await Shop.findById(dto.shopId);

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(dto.shopId) },
      });
    }

    const userGame = await UserGame.findOne({
      userId: dto.userId,
      shopId: dto.shopId,
    }).sort({ lastPlayedAt: -1 });

    if (userGame?.lastPlayedAt) {
      const now = new Date();
      const lastPlayed = new Date(userGame.lastPlayedAt);
      const timeDiffMs = now.getTime() - lastPlayed.getTime();
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;

      if (timeDiffMs < twentyFourHoursMs) {
        const remainingMs = twentyFourHoursMs - timeDiffMs;
        const nextAllowedTime = new Date(
          lastPlayed.getTime() + twentyFourHoursMs
        );

        return res.status(400).json({
          statusCode: 400,
          error: {
            code: 'USER_COOLDOWN',
            message:
              'You can play again after 24 hours from your last game at this shop',
            timestamp: nextAllowedTime.getTime(),
            remainingTime: remainingMs,
            userId: dto.userId,
          },
        });
      }
    }

    const isValid = shop.gameCodePin === dto.gameCodePin;
    if (isValid) {
      const action = await ChosenAction.findById(dto.actionId);

      if (!action || !dto.actionId) {
        return res.status(404).json({
          statusCode: 404,
          error: { message: ChosenActionMessages.NOT_FOUND(dto.actionId) },
        });
      }

      await RewardRedemption.create({
        chosenActionId: action.id,
        shopId: shop.id,
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        isValid,
        message: isValid
          ? ShopMessages.GAME_CODE_MATCHED
          : ShopMessages.GAME_CODE_MISMATCH,
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
  findAllByAdmin,
  findOne,
  findOneByAdmin,
  update,
  updateByAdmin,
  remove,
  removeByAdmin,
  updateStatus,
  updateStatusByAdmin,
  getShopsByStatus,
  getShopsByStatusAndAdmin,
  verifyGameCodePin,
};
