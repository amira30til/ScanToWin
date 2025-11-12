const mongoose = require('mongoose');

const actionClickSchema = new mongoose.Schema(
  {
    chosenActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChosenAction',
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    clickedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('ActionClick', actionClickSchema);
