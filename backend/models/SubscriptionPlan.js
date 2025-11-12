const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: String,
    subscriptionStatus: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE'],
    },
    monthlyPrice: Number,
    annualPrice: Number,
    isCustom: Boolean,
    freeTrialDays: Number,
    discount: Number,
    averageReviews: Number,
    type: {
      type: String,
      default: 'MONTHLY',
      enum: ['MONTHLY', 'ANNUAL'],
    },
    tag: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
