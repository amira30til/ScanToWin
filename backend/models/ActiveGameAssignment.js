const mongoose = require('mongoose');

const activeGameAssignmentSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rewardIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActiveGameAssignment', activeGameAssignmentSchema);
