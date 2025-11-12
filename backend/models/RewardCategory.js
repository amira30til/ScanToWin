const mongoose = require('mongoose');

const rewardCategorySchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RewardCategory', rewardCategorySchema);
