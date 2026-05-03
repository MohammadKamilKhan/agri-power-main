import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [regions, setRegions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'region-wise',
        region: '',
        customer: '',
        startTime: '',
        endTime: '',
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        powerStatus: 'on',
        ratePerUnit: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [schedulesRes, regionsRes, customersRes] = await Promise.all([
                api.get('/admin/schedules'),
                api.get('/admin/regions'),
                api.get('/admin/customers')
            ]);
            setSchedules(schedulesRes.data.schedules);
            setRegions(regionsRes.data.regions);
            setCustomers(customersRes.data.customers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only send the relevant field based on schedule type
            const payload = { ...formData };
            if (payload.type === 'region-wise') {
                delete payload.customer;
            } else {
                delete payload.region;
            }

            await api.post('/admin/schedules', payload);
            setShowModal(false);
            setFormData({
                type: 'region-wise',
                region: '',
                customer: '',
                startTime: '',
                endTime: '',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                powerStatus: 'on',
                ratePerUnit: '',
                description: ''
            });
            fetchData();
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert(error.response?.data?.message || 'Error creating schedule');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this schedule?')) return;

        try {
            await api.delete(`/admin/schedules/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Schedule Management</h1>
                        <button onClick={() => setShowModal(true)} className="btn-primary">
                            + Create Schedule
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {schedules.map((schedule) => (
                            <div key={schedule._id} className="card">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                                            {schedule.type}
                                        </span>
                                        <h3 className="text-lg font-bold text-black mt-2">
                                            {schedule.type === 'region-wise'
                                                ? schedule.region?.name
                                                : schedule.customer?.name}
                                        </h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${schedule.powerStatus === 'on'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {schedule.powerStatus.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-900">Time:</span>
                                        <span className="font-semibold text-black">{schedule.startTime} - {schedule.endTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-900">Rate:</span>
                                        <span className="font-semibold text-black">₹{schedule.ratePerUnit}/unit</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-900">Days:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {schedule.daysOfWeek.map((day) => (
                                                <span key={day} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                    {day.substring(0, 3)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {schedule.description && (
                                        <p className="text-gray-800 mt-2">{schedule.description}</p>
                                    )}
                                </div>

                                <button onClick={() => handleDelete(schedule._id)} className="btn-danger w-full mt-4">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4">Create Schedule</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="label">Schedule Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="region-wise">Region-wise</option>
                                            <option value="customer-specific">Customer-specific</option>
                                        </select>
                                    </div>

                                    {formData.type === 'region-wise' ? (
                                        <div>
                                            <label className="label">Region</label>
                                            <select
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                className="input-field"
                                                required
                                            >
                                                <option value="">Select Region</option>
                                                {regions.map((region) => (
                                                    <option key={region._id} value={region._id}>{region.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="label">Customer</label>
                                            <select
                                                value={formData.customer}
                                                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                                className="input-field"
                                                required
                                            >
                                                <option value="">Select Customer</option>
                                                {customers.map((customer) => (
                                                    <option key={customer._id} value={customer._id}>{customer.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Start Time</label>
                                            <input
                                                type="time"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label">End Time</label>
                                            <input
                                                type="time"
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Rate per Unit (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.ratePerUnit}
                                            onChange={(e) => setFormData({ ...formData, ratePerUnit: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input-field"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <button type="submit" className="btn-primary flex-1">Create</button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagement;
