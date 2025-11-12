const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    name: String,
    icon: String,
    winnerCount: {
      type: Number,
      default: 0,
    },
    isUnlimited: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE'],
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    nbRewardTowin: {
      type: Number,
      default: null,
    },
    percentage: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reward', rewardSchema);
