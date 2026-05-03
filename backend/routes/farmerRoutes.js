const express = require('express');
const router = express.Router();
const { protect, requireFarmer } = require('../middleware/auth');
const {
    getDashboard,
    getSchedules,
    getUsage,
    getBilling,
    getComplaints,
    createComplaint
} = require('../controllers/farmerController');

// All routes require authentication and farmer role
router.use(protect);
router.use(requireFarmer);

// Dashboard
router.get('/dashboard', getDashboard);

// Schedules
router.get('/schedules', getSchedules);

// Usage
router.get('/usage', getUsage);

// Billing
router.get('/billing', getBilling);

// Complaints
router.route('/complaints')
    .get(getComplaints)
    .post(createComplaint);

module.exports = router;
