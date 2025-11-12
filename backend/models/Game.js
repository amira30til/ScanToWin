const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: String,
    status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE'],
    },
    pictureUrl: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', gameSchema);
