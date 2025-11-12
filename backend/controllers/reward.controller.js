const Reward = require('../models/Reward');
const Shop = require('../models/Shop');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { RewardMessages, ShopMessages } = require('../common/constants/messages.constants');

const upsertMany = async (req, res) => {
  try {
    const { shopId, rewards: dtoArr } = req.body;

    const shop = await Shop.findById(shopId).populate('rewards');
    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ShopMessages.SHOP_NOT_FOUND(shopId) },
      });
    }

    const nameSet = new Set();
    for (const dto of dtoArr) {
      const lower = dto.name.trim().toLowerCase();
      if (nameSet.has(lower)) {
        return res.status(400).json({
          statusCode: 400,
          error: { message: `Duplicate reward name: "${dto.name}"` },
        });
      }
      nameSet.add(lower);
    }

    for (const dto of dtoArr) {
      if (!dto.percentage || dto.percentage <= 0 || dto.percentage > 100) {
        return res.status(400).json({
          statusCode: 400,
          error: {
            message: `Invalid percentage for "${dto.name}": must be between 1 and 100`,
          },
        });
      }
      if (dto.isUnlimited && dto.nbRewardTowin != 0) {
        return res.status(400).json({
          statusCode: 400,
          error: {
            message: `Unlimited reward "${dto.name}" cannot have nbRewardTowin set`,
          },
        });
      }
      if (
        !dto.isUnlimited &&
        (dto.nbRewardTowin == null || dto.nbRewardTowin < 1)
      ) {
        return res.status(400).json({
          statusCode: 400,
          error: {
            message: `Reward "${dto.name}" must have a valid nbRewardTowin when not unlimited`,
          },
        });
      }
    }

    const dbRewards = shop.rewards || [];
    const incomingIds = new Set(dtoArr.filter((d) => d.id).map((d) => d.id));

    const toDeleteIds = dbRewards
      .filter((r) => !incomingIds.has(r.id.toString()))
      .map((r) => r.id);

    const toCreateDtos = dtoArr.filter((d) => !d.id);
    const toUpdateDtos = dtoArr.filter((d) => d.id);

    const outgoingActiveDtos = dtoArr.filter((d) => d.status === 'ACTIVE');
    const totalPct = outgoingActiveDtos.reduce(
      (sum, d) => sum + (d.percentage || 0),
      0
    );

    if (outgoingActiveDtos.length > 0 && totalPct !== 100) {
      return res.status(400).json({
        statusCode: 400,
        error: {
          message: `Total percentage of ACTIVE rewards must equal 100%. Current sum: ${totalPct}%`,
        },
      });
    }

    const hasUnlimited = outgoingActiveDtos.some((d) => d.isUnlimited);
    if (shop.isGuaranteedWin && !hasUnlimited) {
      return res.status(409).json({
        statusCode: 409,
        error: {
          message:
            'Pour un jeu 100% gagnant, vous devez définir au moins un gain illimité (isUnlimited = true). Sinon, désactivez l\'option 100% gagnant.',
        },
      });
    }

    const created = await Promise.all(
      toCreateDtos.map(async (d) => {
        return await Reward.create({
          ...d,
          shopId,
          nbRewardTowin: d.isUnlimited ? null : d.nbRewardTowin,
        });
      })
    );

    const updated = await Promise.all(
      toUpdateDtos.map(async (d) => {
        const reward = await Reward.findById(d.id);
        if (!reward) {
          throw new Error(`Reward not found: ${d.id}`);
        }
        Object.assign(reward, {
          name: d.name,
          icon: d.icon,
          isUnlimited: d.isUnlimited,
          status: d.status,
          percentage: d.percentage,
          nbRewardTowin: d.isUnlimited ? null : d.nbRewardTowin,
        });
        return await reward.save();
      })
    );

    if (toDeleteIds.length) {
      await Reward.deleteMany({ _id: { $in: toDeleteIds } });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        created,
        updated,
        deleted: toDeleteIds,
        message: RewardMessages.REWARDS_UPSERT_DONE,
      })
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

    const rewards = await Reward.find().skip(skip).limit(limit);
    const total = await Reward.countDocuments();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        rewards,
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

const findAllByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const rewards = await Reward.find({ shopId })
      .skip(skip)
      .limit(limit);
    const total = await Reward.countDocuments({ shopId });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        rewards,
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
    const reward = await Reward.findById(id).populate('shopId');

    if (!reward) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: RewardMessages.REWARD_NOT_FOUND(id) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        reward,
        message: RewardMessages.REWARD_RETRIEVED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const update = async (req, res) => {
  try {
    const { id, shopId } = req.params;
    const dto = req.body;

    const reward = await Reward.findOne({ _id: id, shopId });
    if (!reward) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: `Reward with ID '${id}' not found for this shop` },
      });
    }

    const shop = await Shop.findById(shopId);
    if (
      shop.isGuaranteedWin &&
      dto.isUnlimited === false &&
      reward.isUnlimited === true
    ) {
      const otherUnlimitedRewards = await Reward.countDocuments({
        shopId,
        isUnlimited: true,
        _id: { $ne: id },
      });

      if (otherUnlimitedRewards === 0) {
        return res.status(409).json({
          statusCode: 409,
          error: { message: RewardMessages.CANNOT_REMOVE_LAST_UNLIMITED },
        });
      }
    }

    Object.assign(reward, dto);
    if (dto.isUnlimited !== undefined) {
      reward.nbRewardTowin = dto.isUnlimited ? null : dto.nbRewardTowin;
    }
    const updatedReward = await reward.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        reward: updatedReward,
        message: RewardMessages.REWARD_UPDATED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const remove = async (req, res) => {
  try {
    const { id, shopId } = req.params;
    const reward = await Reward.findOne({ _id: id, shopId });

    if (!reward) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: RewardMessages.REWARD_NOT_FOUND(id) },
      });
    }

    await Reward.findByIdAndDelete(id);

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: RewardMessages.REWARD_DELETED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

module.exports = {
  upsertMany,
  findAll,
  findAllByShop,
  findOne,
  update,
  remove,
};
