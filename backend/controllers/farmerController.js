const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Usage = require('../models/Usage');
const Complaint = require('../models/Complaint');
const Region = require('../models/Region');

// @desc    Get farmer dashboard
// @route   GET /api/farmer/dashboard
// @access  Private/Farmer
exports.getDashboard = async (req, res) => {
    try {
        const farmer = await User.findById(req.user._id).populate('region');

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        let schedules = [];
        let currentUsage = { unitsConsumed: 0, totalCost: 0 };

        // Only fetch schedules if farmer has a region
        if (farmer.region) {
            // Get schedules for this farmer
            const customerSchedules = await Schedule.find({
                type: 'customer-specific',
                customer: farmer._id,
                isActive: true
            });

            const regionSchedules = await Schedule.find({
                type: 'region-wise',
                region: farmer.region._id,
                isActive: true
            });

            schedules = [...customerSchedules, ...regionSchedules];

            // Get current month usage
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            const usage = await Usage.findOne({
                customer: farmer._id,
                month: currentMonth,
                year: currentYear
            });

            if (usage) {
                currentUsage = usage;
            }
        }

        // Get pending complaints
        const pendingComplaints = await Complaint.countDocuments({
            customer: farmer._id,
            status: { $ne: 'resolved' }
        });

        res.status(200).json({
            success: true,
            farmer: {
                name: farmer.name,
                email: farmer.email,
                phone: farmer.phone,
                address: farmer.address,
                region: farmer.region
            },
            schedules,
            currentUsage,
            pendingComplaints
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get farmer schedules
// @route   GET /api/farmer/schedules
// @access  Private/Farmer
exports.getSchedules = async (req, res) => {
    try {
        const farmer = await User.findById(req.user._id);

        // Get customer-specific schedules
        const customerSchedules = await Schedule.find({
            type: 'customer-specific',
            customer: farmer._id,
            isActive: true
        });

        // Get region-wise schedules
        const regionSchedules = await Schedule.find({
            type: 'region-wise',
            region: farmer.region,
            isActive: true
        }).populate('region');

        const schedules = [...customerSchedules, ...regionSchedules];

        res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get farmer usage
// @route   GET /api/farmer/usage
// @access  Private/Farmer
exports.getUsage = async (req, res) => {
    try {
        const { year } = req.query;
        const currentYear = year ? parseInt(year) : new Date().getFullYear();

        const usage = await Usage.find({
            customer: req.user._id,
            year: currentYear
        }).sort({ month: 1 });

        res.status(200).json({ success: true, usage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get farmer billing
// @route   GET /api/farmer/billing
// @access  Private/Farmer
exports.getBilling = async (req, res) => {
    try {
        const { month, year } = req.query;

        let filter = { customer: req.user._id };
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const billing = await Usage.find(filter)
            .populate('region')
            .sort({ year: -1, month: -1 });

        const totalCost = billing.reduce((sum, record) => sum + record.totalCost, 0);
        const totalUnits = billing.reduce((sum, record) => sum + record.unitsConsumed, 0);

        res.status(200).json({
            success: true,
            billing,
            summary: {
                totalCost,
                totalUnits,
                recordCount: billing.length
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get farmer complaints
// @route   GET /api/farmer/complaints
// @access  Private/Farmer
exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ customer: req.user._id })
            .populate('resolvedBy')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create complaint
// @route   POST /api/farmer/complaints
// @access  Private/Farmer
exports.createComplaint = async (req, res) => {
    try {
        const { subject, description, priority } = req.body;

        const complaint = await Complaint.create({
            customer: req.user._id,
            subject,
            description,
            priority: priority || 'medium'
        });

        const populatedComplaint = await Complaint.findById(complaint._id)
            .populate('customer');

        res.status(201).json({ success: true, complaint: populatedComplaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
