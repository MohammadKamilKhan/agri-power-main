const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    unitsConsumed: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    ratePerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    totalCost: {
        type: Number,
        default: 0
    },
    billingDate: {
        type: Date,
        default: Date.now
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate total cost before saving
usageSchema.pre('save', function (next) {
    this.totalCost = this.unitsConsumed * this.ratePerUnit;
    next();
});

// Index for faster queries
usageSchema.index({ customer: 1, month: 1, year: 1 });
usageSchema.index({ region: 1, month: 1, year: 1 });

module.exports = mongoose.model('Usage', usageSchema);
