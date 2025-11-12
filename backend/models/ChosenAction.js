const mongoose = require('mongoose');

const chosenActionSchema = new mongoose.Schema(
  {
    name: String,
    position: Number,
    targetLink: String,
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    actionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Action',
    },
    redeemedReward: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChosenAction', chosenActionSchema);
