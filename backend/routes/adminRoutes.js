const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
    getDashboard,
    getRegions,
    createRegion,
    updateRegion,
    deleteRegion,
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getUsage,
    createUsage,
    getBilling,
    getComplaints,
    updateComplaint,
    getLogs
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Regions
router.route('/regions')
    .get(getRegions)
    .post(createRegion);

router.route('/regions/:id')
    .put(updateRegion)
    .delete(deleteRegion);

// Customers
router.route('/customers')
    .get(getCustomers)
    .post(createCustomer);

router.route('/customers/:id')
    .put(updateCustomer)
    .delete(deleteCustomer);

// Schedules
router.route('/schedules')
    .get(getSchedules)
    .post(createSchedule);

router.route('/schedules/:id')
    .put(updateSchedule)
    .delete(deleteSchedule);

// Usage and Billing
router.route('/usage')
    .get(getUsage)
    .post(createUsage);
router.get('/billing', getBilling);

// Complaints
router.get('/complaints', getComplaints);
router.put('/complaints/:id', updateComplaint);

// Logs
router.get('/logs', getLogs);

module.exports = router;
