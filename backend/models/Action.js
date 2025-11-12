const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema(
  {
    name: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Action', actionSchema);
