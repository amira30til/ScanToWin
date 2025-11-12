const Action = require('../models/Action');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { ActionMessages } = require('../common/constants/messages.constants');

const create = async (req, res) => {
  try {
    const dto = req.body;
    const existing = await Action.findOne({ name: dto.name });

    if (existing) {
      return res.status(409).json({
        statusCode: 409,
        error: { message: ActionMessages.ACTION_NAME_EXISTS(dto.name) },
      });
    }

    const newAction = await Action.create(dto);
    return res.status(HttpStatusCodes.CREATED).json(
      ApiResponse.success(HttpStatusCodes.CREATED, {
        action: newAction,
        message: ActionMessages.ACTION_CREATED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAll = async (req, res) => {
  try {
    const actions = await Action.find();
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        actions,
        message: ActionMessages.ACTIONS_RETRIEVED,
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
    const action = await Action.findById(id);
    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ActionMessages.ACTION_NOT_FOUND(id) },
      });
    }

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        action,
        message: ActionMessages.ACTION_RETRIEVED,
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
    const action = await Action.findById(id);

    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ActionMessages.ACTION_NOT_FOUND(id) },
      });
    }

    Object.assign(action, dto);
    const saved = await action.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        action: saved,
        message: ActionMessages.ACTION_UPDATED,
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
    const action = await Action.findById(id);

    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ActionMessages.ACTION_NOT_FOUND(id) },
      });
    }

    await Action.findByIdAndDelete(id);
    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        id,
        message: ActionMessages.ACTION_DELETED,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const softDeleteAction = async (req, res) => {
  try {
    const { id } = req.params;
    const action = await Action.findById(id);

    if (!action) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: ActionMessages.ACTION_NOT_FOUND(id) },
      });
    }

    if (!action.isActive) {
      return res.status(409).json({
        statusCode: 409,
        error: { message: 'Action is already inactive.' },
      });
    }

    action.isActive = false;
    await action.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        id,
        message: ActionMessages.ACTION_SOFT_DELETED,
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
  softDeleteAction,
};
