const ChosenAction = require('../models/ChosenAction');
const Action = require('../models/Action');
const Shop = require('../models/Shop');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { ChosenActionMessages } = require('../common/constants/messages.constants');

const syncChosenActions = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { chosenActions: receivedActions } = req.body;

    const existingActions = await ChosenAction.find({ shopId });

    const receivedIds = receivedActions
      .filter((a) => a.id)
      .map((a) => a.id);

    const toDelete = existingActions.filter(
      (dbItem) => !receivedIds.includes(dbItem.id.toString())
    );

    if (toDelete.length > 0) {
      await ChosenAction.deleteMany({
        _id: { $in: toDelete.map((a) => a.id) },
      });
    }

    if (receivedActions.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        error: { message: 'At least one chosen action must be provided.' },
      });
    }

    const results = [];

    for (const actionDto of receivedActions) {
      const action = await Action.findOne({
        _id: actionDto.actionId,
        isActive: true,
      });

      if (!action) {
        return res.status(404).json({
          statusCode: 404,
          error: {
            message: `Action with ID ${actionDto.actionId} is not active or does not exist`,
          },
        });
      }

      if (!actionDto.id) {
        const newChosen = await ChosenAction.create({
          ...actionDto,
          shopId,
        });
        results.push(newChosen);
      } else {
        const existing = await ChosenAction.findOne({
          _id: actionDto.id,
          shopId,
        });

        if (!existing) continue;

        const hasChanges =
          existing.name !== actionDto.name ||
          existing.position !== actionDto.position ||
          existing.targetLink !== actionDto.targetLink ||
          existing.actionId.toString() !== actionDto.actionId;

        if (hasChanges) {
          Object.assign(existing, actionDto);
          const saved = await existing.save();
          results.push(saved);
        } else {
          results.push(existing);
        }
      }
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenActions: results,
        message: `Chosen actions synced for shop ${shopId}`,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const actions = await ChosenAction.find();
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenActions: actions,
        message: ChosenActionMessages.ALL_RETRIEVED,
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
    const action = await ChosenAction.findById(id);
    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ChosenActionMessages.NOT_FOUND(id) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenAction: action,
        message: ChosenActionMessages.RETRIEVED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;
    const actions = await ChosenAction.find({ shopId });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenActions: actions,
        message: ChosenActionMessages.BY_SHOP_RETRIEVED(shopId),
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
    const dto = req.body;
    const action = await ChosenAction.findById(id);
    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ChosenActionMessages.NOT_FOUND(id) },
      });
    }

    Object.assign(action, dto);
    const saved = await action.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        chosenAction: saved,
        message: ChosenActionMessages.UPDATED,
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
    const action = await ChosenAction.findById(id);
    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ChosenActionMessages.NOT_FOUND(id) },
      });
    }

    await ChosenAction.findByIdAndDelete(id);
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        id,
        message: ChosenActionMessages.DELETED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

module.exports = {
  syncChosenActions,
  findAll,
  findOne,
  findByShopId,
  update,
  remove,
};
