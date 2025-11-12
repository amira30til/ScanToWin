const mongoose = require('mongoose');

const adminSubscriptionSchema = new mongoose.Schema(
  {
    BillingPeriode: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'CANCELED'],
    },
    price: Number,
    isActive: Boolean,
    canceledAt: Date,
    currentPeriodEnd: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminSubscription', adminSubscriptionSchema);
