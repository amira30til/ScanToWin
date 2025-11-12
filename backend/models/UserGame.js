const mongoose = require('mongoose');

const userGameSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    activeGameAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActiveGameAssignment',
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    playCount: {
      type: Number,
      default: 1,
    },
    lastPlayedAt: {
      type: Date,
      default: Date.now,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    nbPlayedTimes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserGame', userGameSchema);
