const mongoose = require('mongoose');

const gamePlayTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    activeGameAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActiveGameAssignment',
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
    },
    chosenActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChosenAction',
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('GamePlayTracking', gamePlayTrackingSchema);
