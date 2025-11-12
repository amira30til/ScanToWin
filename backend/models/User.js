const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: String,
    lastName: String,
    tel: String,
    totalPlayedGames: {
      type: Number,
      default: 0,
    },
    agreeToPromotions: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
