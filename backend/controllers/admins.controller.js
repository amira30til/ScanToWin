const Admin = require('../models/Admin');
const Shop = require('../models/Shop');
const bcrypt = require('bcryptjs');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { UserMessages } = require('../common/constants/messages.constants');
const cloudinaryService = require('../services/cloudinary.service');

const create = async (req, res) => {
  try {
    const dto = req.body;
    const profilPicture = req.file;

    if (dto.email) {
      const emailExists = await Admin.findOne({
        email: dto.email.toLowerCase(),
      });
      if (emailExists) {
        return res.status(409).json({
          statusCode: 409,
          error: { message: UserMessages.USER_ALREADY_EXISTS('email') },
        });
      }
    }

    let profilePictureUrl = null;
    if (profilPicture) {
      try {
        const uploadResult =
          await cloudinaryService.uploadImageToCloudinary(profilPicture);
        profilePictureUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        profilePictureUrl = null;
      }
    }

    const newUser = {
      ...dto,
      email: dto.email?.toLowerCase(),
      profilPicture: profilePictureUrl || undefined,
    };

    const salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const userSaved = await Admin.create(newUser);

    const { password, ...userResponse } = userSaved.toObject();

    return res
      .status(HttpStatusCodes.CREATED)
      .json(ApiResponse.success(HttpStatusCodes.CREATED, { user: userResponse }));
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

    const admins = await Admin.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Admin.countDocuments();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        admins,
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
    const admin = await Admin.findOne({
      _id: id,
      adminStatus: 'ACTIVE',
    });

    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }

    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { admin }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
      adminStatus: 'ACTIVE',
    });

    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.EMAIL_USER_NOT_FOUND(email) },
      });
    }

    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, { admin }));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateAdminDto = req.body;
    const profilPicture = req.file;

    const admin = await Admin.findOne({
      _id: id,
      adminStatus: 'ACTIVE',
    });

    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }

    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const emailExists = await Admin.findOne({
        email: updateAdminDto.email.toLowerCase(),
      });

      if (emailExists) {
        return res.status(409).json({
          statusCode: 409,
          error: { message: UserMessages.USER_ALREADY_EXISTS('email') },
        });
      }

      updateAdminDto.email = updateAdminDto.email.toLowerCase();
    }

    if (profilPicture) {
      const result = await cloudinaryService.uploadImageToCloudinary(profilPicture);
      updateAdminDto.profilPicture = result.url;
    }

    await Admin.findByIdAndUpdate(id, updateAdminDto);

    const updatedAdmin = await Admin.findById(id);

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, { admin: updatedAdmin })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }

    admin.adminStatus = 'ARCHIVED';
    await admin.save();

    await Shop.updateMany({ adminId: admin.id }, { status: 'ARCHIVED' });

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: `Admin with ID ${id} has been archived`,
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
    const { status } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }

    admin.adminStatus = status;
    const updatedAdmin = await admin.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, { admin: updatedAdmin })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const findAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({
      _id: id,
      role: 'ADMIN',
    })
      .populate({
        path: 'shops',
        populate: [
          { path: 'rewards' },
          { path: 'chosenActions' },
          {
            path: 'activeGameAssignments',
            populate: { path: 'game' },
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.json(ApiResponse.success(HttpStatusCodes.SUCCESS, admin));
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({
      _id: id,
      adminStatus: 'ACTIVE',
    });

    if (!admin) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_NOT_FOUND(id) },
      });
    }

    await Admin.findByIdAndDelete(id);

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        message: UserMessages.USER_DELETE_SUCCESS(id),
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
  findByEmail,
  update,
  remove,
  updateStatus,
  findAdminById,
  removeAdmin,
};
