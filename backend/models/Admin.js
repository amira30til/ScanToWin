const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      default: 'ADMIN',
      enum: ['ADMIN', 'SUPER_ADMIN'],
    },
    verificationCode: {
      type: String,
      default: null,
    },
    tel: Number,
    refreshToken: {
      type: String,
      default: null,
    },
    resetToken: String,
    resetTokenExp: Date,
    adminStatus: {
      type: String,
      default: 'ACTIVE',
      enum: ['ARCHIVED', 'ACTIVE', 'INACTIVE'],
    },
    profilPicture: String,
    mailStatus: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);
