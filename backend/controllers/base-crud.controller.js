const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');

const createCRUDController = (Model, messages = {}) => ({
  create: async (req, res) => {
    try {
      const newItem = await Model.create(req.body);
      return res.status(HttpStatusCodes.CREATED).json(
        ApiResponse.success(HttpStatusCodes.CREATED, {
          [Model.modelName.toLowerCase()]: newItem,
          message: messages.CREATED || 'Created successfully',
        })
      );
    } catch (error) {
      const errorResponse = handleServiceError(error);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  },

  findAll: async (req, res) => {
    try {
      const items = await Model.find();
      return res.json(
        ApiResponse.success(HttpStatusCodes.SUCCESS, {
          [Model.modelName.toLowerCase() + 's']: items,
          message: messages.FETCHED || 'Fetched successfully',
        })
      );
    } catch (error) {
      const errorResponse = handleServiceError(error);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Model.findById(id);
      if (!item) {
        return res.status(404).json({
          statusCode: 404,
          error: { message: messages.NOT_FOUND?.(id) || 'Not found' },
        });
      }
      return res.json(
        ApiResponse.success(HttpStatusCodes.SUCCESS, {
          [Model.modelName.toLowerCase()]: item,
        })
      );
    } catch (error) {
      const errorResponse = handleServiceError(error);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Model.findByIdAndUpdate(id, req.body, { new: true });
      if (!item) {
        return res.status(404).json({
          statusCode: 404,
          error: { message: messages.NOT_FOUND?.(id) || 'Not found' },
        });
      }
      return res.json(
        ApiResponse.success(HttpStatusCodes.SUCCESS, {
          [Model.modelName.toLowerCase()]: item,
          message: messages.UPDATED || 'Updated successfully',
        })
      );
    } catch (error) {
      const errorResponse = handleServiceError(error);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Model.findByIdAndDelete(id);
      if (!item) {
        return res.status(404).json({
          statusCode: 404,
          error: { message: messages.NOT_FOUND?.(id) || 'Not found' },
        });
      }
      return res.json(
        ApiResponse.success(HttpStatusCodes.SUCCESS, {
          message: messages.DELETED || 'Deleted successfully',
        })
      );
    } catch (error) {
      const errorResponse = handleServiceError(error);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  },
});
module.exports = createCRUDController;
