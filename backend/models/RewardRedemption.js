const mongoose = require('mongoose');

const rewardRedemptionSchema = new mongoose.Schema(
  {
    chosenActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChosenAction',
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('RewardRedemption', rewardRedemptionSchema);
