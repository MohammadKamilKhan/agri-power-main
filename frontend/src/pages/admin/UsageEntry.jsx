import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const UsageEntry = () => {
    const [customers, setCustomers] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        customer: '',
        region: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        unitsConsumed: '',
        ratePerUnit: '',
        isPaid: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [customersRes, regionsRes] = await Promise.all([
                api.get('/admin/customers'),
                api.get('/admin/regions')
            ]);
            setCustomers(customersRes.data.customers);
            setRegions(regionsRes.data.regions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        const selectedCustomer = customers.find(c => c._id === customerId);
        setFormData({
            ...formData,
            customer: customerId,
            region: selectedCustomer?.region?._id || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/usage', {
                ...formData,
                unitsConsumed: parseFloat(formData.unitsConsumed),
                ratePerUnit: parseFloat(formData.ratePerUnit)
            });
            setMessage('✅ Usage record created successfully!');
            setFormData({
                customer: '',
                region: '',
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                unitsConsumed: '',
                ratePerUnit: '',
                isPaid: false
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Usage Record</h1>
                    <p className="text-gray-600 mb-8">Manually add electricity usage data for any customer.</p>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">New Usage Entry</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="label">Customer *</label>
                                    <select
                                        value={formData.customer}
                                        onChange={handleCustomerChange}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer._id} value={customer._id}>
                                                {customer.name} ({customer.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Region *</label>
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
                                    <p className="text-xs text-gray-500 mt-1">Auto-filled based on customer. Can be changed if needed.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Month *</label>
                                        <select
                                            value={formData.month}
                                            onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                            className="input-field"
                                            required
                                        >
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Year *</label>
                                        <select
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            className="input-field"
                                            required
                                        >
                                            {[2024, 2025, 2026].map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Units Consumed (kWh) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.unitsConsumed}
                                            onChange={(e) => setFormData({ ...formData, unitsConsumed: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. 350"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Rate per Unit (₹) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.ratePerUnit}
                                            onChange={(e) => setFormData({ ...formData, ratePerUnit: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. 7.50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Estimated Total Cost</label>
                                    <div className="text-2xl font-bold text-primary-600">
                                        ₹{formData.unitsConsumed && formData.ratePerUnit
                                            ? (parseFloat(formData.unitsConsumed) * parseFloat(formData.ratePerUnit)).toFixed(2)
                                            : '0.00'}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isPaid"
                                        checked={formData.isPaid}
                                        onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isPaid" className="text-sm text-gray-700">Mark as Paid</label>
                                </div>

                                <button type="submit" className="btn-primary w-full">
                                    Add Usage Record
                                </button>
                            </form>
                        </div>

                        {/* Quick Reference */}
                        <div className="space-y-6">
                            <div className="card bg-blue-50">
                                <h3 className="text-lg font-bold text-blue-800 mb-3">💡 How It Works</h3>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li>• Select a customer and their region auto-fills</li>
                                    <li>• Enter units consumed (kWh) from the meter</li>
                                    <li>• Enter rate per unit (₹) based on their schedule</li>
                                    <li>• Total cost calculates automatically: Units × Rate</li>
                                    <li>• The record appears instantly in Billing Reports</li>
                                </ul>
                            </div>

                            <div className="card bg-yellow-50">
                                <h3 className="text-lg font-bold text-yellow-800 mb-3">📊 Sample Values</h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-yellow-800 border-b border-yellow-200">
                                            <th className="text-left py-2">Customer</th>
                                            <th className="text-right py-2">Units</th>
                                            <th className="text-right py-2">Rate</th>
                                            <th className="text-right py-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-yellow-700">
                                        <tr><td className="py-1">Small Farm</td><td className="text-right">250</td><td className="text-right">5.50</td><td className="text-right">₹1,375</td></tr>
                                        <tr><td className="py-1">Medium Farm</td><td className="text-right">450</td><td className="text-right">6.00</td><td className="text-right">₹2,700</td></tr>
                                        <tr><td className="py-1">Large Farm</td><td className="text-right">800</td><td className="text-right">7.50</td><td className="text-right">₹6,000</td></tr>
                                        <tr><td className="py-1">Industrial</td><td className="text-right">1200</td><td className="text-right">8.00</td><td className="text-right">₹9,600</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="card bg-green-50">
                                <h3 className="text-lg font-bold text-green-800 mb-3">✅ Where Data Appears</h3>
                                <ul className="space-y-2 text-sm text-green-700">
                                    <li>• <strong>Admin Billing Reports</strong> - Top consumers chart & details table</li>
                                    <li>• <strong>Farmer Dashboard</strong> - Current month usage & bill cards</li>
                                    <li>• <strong>Farmer Usage & Billing</strong> - Monthly trend line chart</li>
                                    <li>• <strong>Admin Dashboard</strong> - Monthly revenue summary</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageEntry;

