const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a region name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    powerStatus: {
        type: String,
        enum: ['on', 'off'],
        default: 'on'
    },
    totalCapacity: {
        type: Number,
        required: [true, 'Please provide total capacity'],
        min: 0
    },
    currentLoad: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for load percentage
regionSchema.virtual('loadPercentage').get(function () {
    if (this.totalCapacity === 0) return 0;
    return ((this.currentLoad / this.totalCapacity) * 100).toFixed(2);
});

// Virtual for customer count
regionSchema.virtual('customerCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'region',
    count: true
});

module.exports = mongoose.model('Region', regionSchema);
