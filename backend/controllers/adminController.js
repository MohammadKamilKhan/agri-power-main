const Region = require('../models/Region');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Usage = require('../models/Usage');
const Complaint = require('../models/Complaint');
const Log = require('../models/Log');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
    try {
        const totalRegions = await Region.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'farmer' });
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const monthlyRevenue = await Usage.aggregate([
            { $match: { month: currentMonth, year: currentYear } },
            { $group: { _id: null, total: { $sum: '$totalCost' } } }
        ]);

        const regionStats = await Region.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'region',
                    as: 'customers'
                }
            },
            {
                $project: {
                    name: 1,
                    powerStatus: 1,
                    totalCapacity: 1,
                    currentLoad: 1,
                    customerCount: { $size: '$customers' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalRegions,
                totalCustomers,
                totalComplaints,
                pendingComplaints,
                monthlyRevenue: monthlyRevenue[0]?.total || 0
            },
            regionStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all regions
// @route   GET /api/admin/regions
// @access  Private/Admin
exports.getRegions = async (req, res) => {
    try {
        const regions = await Region.find().sort({ name: 1 });

        // Get customer count for each region
        const regionsWithCount = await Promise.all(
            regions.map(async (region) => {
                const customerCount = await User.countDocuments({ region: region._id });
                return {
                    ...region.toObject(),
                    customerCount
                };
            })
        );

        res.status(200).json({ success: true, regions: regionsWithCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create region
// @route   POST /api/admin/regions
// @access  Private/Admin
exports.createRegion = async (req, res) => {
    try {
        const region = await Region.create(req.body);

        await Log.create({
            user: req.user._id,
            action: 'CREATE_REGION',
            details: `Created region: ${region.name}`,
            ipAddress: req.ip
        });

        res.status(201).json({ success: true, region });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update region
// @route   PUT /api/admin/regions/:id
// @access  Private/Admin
exports.updateRegion = async (req, res) => {
    try {
        const region = await Region.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!region) {
            return res.status(404).json({ message: 'Region not found' });
        }

        await Log.create({
            user: req.user._id,
            action: 'UPDATE_REGION',
            details: `Updated region: ${region.name}`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, region });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete region
// @route   DELETE /api/admin/regions/:id
// @access  Private/Admin
exports.deleteRegion = async (req, res) => {
    try {
        const region = await Region.findById(req.params.id);

        if (!region) {
            return res.status(404).json({ message: 'Region not found' });
        }

        // Check if region has customers
        const customerCount = await User.countDocuments({ region: req.params.id });
        if (customerCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete region with assigned customers. Please reassign customers first.'
            });
        }

        await region.deleteOne();

        await Log.create({
            user: req.user._id,
            action: 'DELETE_REGION',
            details: `Deleted region: ${region.name}`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, message: 'Region deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'farmer' })
            .populate('region')
            .sort({ name: 1 });

        res.status(200).json({ success: true, customers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create customer
// @route   POST /api/admin/customers
// @access  Private/Admin
exports.createCustomer = async (req, res) => {
    try {
        const customer = await User.create({
            ...req.body,
            role: 'farmer'
        });

        await Log.create({
            user: req.user._id,
            action: 'CREATE_CUSTOMER',
            details: `Created customer: ${customer.name}`,
            ipAddress: req.ip
        });

        const populatedCustomer = await User.findById(customer._id).populate('region');

        res.status(201).json({ success: true, customer: populatedCustomer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update customer
// @route   PUT /api/admin/customers/:id
// @access  Private/Admin
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('region');

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await Log.create({
            user: req.user._id,
            action: 'UPDATE_CUSTOMER',
            details: `Updated customer: ${customer.name}`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, customer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private/Admin
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.deleteOne();

        await Log.create({
            user: req.user._id,
            action: 'DELETE_CUSTOMER',
            details: `Deleted customer: ${customer.name}`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all schedules
// @route   GET /api/admin/schedules
// @access  Private/Admin
exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('region')
            .populate('customer')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create schedule
// @route   POST /api/admin/schedules
// @access  Private/Admin
exports.createSchedule = async (req, res) => {
    try {
        // Clean up empty strings so Mongoose doesn't try to cast them to ObjectId
        const scheduleData = { ...req.body };
        if (scheduleData.region === '') delete scheduleData.region;
        if (scheduleData.customer === '') delete scheduleData.customer;

        const schedule = await Schedule.create(scheduleData);

        await Log.create({
            user: req.user._id,
            action: 'CREATE_SCHEDULE',
            details: `Created ${schedule.type} schedule`,
            ipAddress: req.ip
        });

        const populatedSchedule = await Schedule.findById(schedule._id)
            .populate('region')
            .populate('customer');

        res.status(201).json({ success: true, schedule: populatedSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update schedule
// @route   PUT /api/admin/schedules/:id
// @access  Private/Admin
exports.updateSchedule = async (req, res) => {
    try {
        // Clean up empty strings so Mongoose doesn't try to cast them to ObjectId
        const scheduleData = { ...req.body };
        if (scheduleData.region === '') delete scheduleData.region;
        if (scheduleData.customer === '') delete scheduleData.customer;

        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            scheduleData,
            { new: true, runValidators: true }
        ).populate('region').populate('customer');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        await Log.create({
            user: req.user._id,
            action: 'UPDATE_SCHEDULE',
            details: `Updated schedule`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, schedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete schedule
// @route   DELETE /api/admin/schedules/:id
// @access  Private/Admin
exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        await schedule.deleteOne();

        await Log.create({
            user: req.user._id,
            action: 'DELETE_SCHEDULE',
            details: `Deleted schedule`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all usage records
// @route   GET /api/admin/usage
// @access  Private/Admin
exports.getUsage = async (req, res) => {
    try {
        const { month, year } = req.query;

        let filter = {};
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const usage = await Usage.find(filter)
            .populate('customer')
            .populate('region')
            .sort({ billingDate: -1 });

        res.status(200).json({ success: true, usage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get billing summary
// @route   GET /api/admin/billing
// @access  Private/Admin
exports.getBilling = async (req, res) => {
    try {
        const { month, year } = req.query;

        const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        const currentYear = year ? parseInt(year) : new Date().getFullYear();

        const billing = await Usage.aggregate([
            { $match: { month: currentMonth, year: currentYear } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo'
                }
            },
            {
                $lookup: {
                    from: 'regions',
                    localField: 'region',
                    foreignField: '_id',
                    as: 'regionInfo'
                }
            },
            {
                $project: {
                    customer: { $arrayElemAt: ['$customerInfo', 0] },
                    region: { $arrayElemAt: ['$regionInfo', 0] },
                    unitsConsumed: 1,
                    ratePerUnit: 1,
                    totalCost: 1,
                    billingDate: 1,
                    isPaid: 1
                }
            }
        ]);

        const totalRevenue = billing.reduce((sum, record) => sum + record.totalCost, 0);
        const totalUnits = billing.reduce((sum, record) => sum + record.unitsConsumed, 0);

        res.status(200).json({
            success: true,
            billing,
            summary: {
                totalRevenue,
                totalUnits,
                totalCustomers: billing.length,
                month: currentMonth,
                year: currentYear
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private/Admin
exports.getComplaints = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = {};
        if (status) filter.status = status;

        const complaints = await Complaint.find(filter)
            .populate('customer')
            .populate('resolvedBy')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update complaint
// @route   PUT /api/admin/complaints/:id
// @access  Private/Admin
exports.updateComplaint = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const updateData = { status, adminNotes };

        if (status === 'resolved') {
            updateData.resolvedBy = req.user._id;
            updateData.resolvedAt = new Date();
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('customer').populate('resolvedBy');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        await Log.create({
            user: req.user._id,
            action: 'UPDATE_COMPLAINT',
            details: `Updated complaint status to ${status}`,
            ipAddress: req.ip
        });

        res.status(200).json({ success: true, complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create usage record
// @route   POST /api/admin/usage
// @access  Private/Admin
exports.createUsage = async (req, res) => {
    try {
        const usage = await Usage.create(req.body);

        await Log.create({
            user: req.user._id,
            action: 'CREATE_USAGE',
            details: `Created usage record for customer: ${usage.customer}`,
            ipAddress: req.ip
        });

        const populatedUsage = await Usage.findById(usage._id)
            .populate('customer')
            .populate('region');

        res.status(201).json({ success: true, usage: populatedUsage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get activity logs
// @route   GET /api/admin/logs
// @access  Private/Admin
exports.getLogs = async (req, res) => {
    try {
        const { action, limit = 100 } = req.query;

        let filter = {};
        if (action) filter.action = action;

        const logs = await Log.find(filter)
            .populate('user')
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.status(200).json({ success: true, logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
