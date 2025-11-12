const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: String,
    address: String,
    city: String,
    country: String,
    zipCode: {
      type: Number,
      default: 0,
    },
    nbSiret: {
      type: Number,
    },
    tel: String,
    status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'ARCHIVED', 'INACTIVE'],
    },
    gameColor1: String,
    gameColor2: String,
    gameCodePin: Number,
    isGuaranteedWin: {
      type: Boolean,
      default: true,
    },
    winningPercentage: {
      type: Number,
      default: 50,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Shop', shopSchema);
