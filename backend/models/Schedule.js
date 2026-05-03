const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['region-wise', 'customer-specific'],
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: function () {
            return this.type === 'region-wise';
        }
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.type === 'customer-specific';
        }
    },
    startTime: {
        type: String,
        required: [true, 'Please provide start time'],
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
        type: String,
        required: [true, 'Please provide end time'],
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    daysOfWeek: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    powerStatus: {
        type: String,
        enum: ['on', 'off'],
        default: 'on'
    },
    ratePerUnit: {
        type: Number,
        required: [true, 'Please provide rate per unit'],
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
scheduleSchema.index({ type: 1, region: 1 });
scheduleSchema.index({ type: 1, customer: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
