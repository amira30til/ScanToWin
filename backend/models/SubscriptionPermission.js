const mongoose = require('mongoose');

const subscriptionPermissionSchema = new mongoose.Schema(
  {
    displayOrder: Number,
    enabled: Boolean,
    subscriptionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
    },
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SubscriptionPermission', subscriptionPermissionSchema);
