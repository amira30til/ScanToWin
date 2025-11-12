const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    key: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Permission', permissionSchema);
