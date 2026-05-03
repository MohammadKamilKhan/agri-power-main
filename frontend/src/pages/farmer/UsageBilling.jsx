import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const UsageBilling = () => {
    const [billing, setBilling] = useState([]);
    const [usage, setUsage] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [billingRes, usageRes] = await Promise.all([
                api.get('/farmer/billing'),
                api.get('/farmer/usage')
            ]);
            setBilling(billingRes.data.billing);
            setSummary(billingRes.data.summary);
            setUsage(usageRes.data.usage);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const chartData = usage.map(record => ({
        month: new Date(2024, record.month - 1).toLocaleString('default', { month: 'short' }),
        units: record.unitsConsumed,
        cost: record.totalCost
    }));

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
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Usage & Billing</h1>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card bg-primary-50">
                            <p className="text-sm text-primary-600 font-medium">Total Cost</p>
                            <p className="text-3xl font-bold text-primary-900">₹{summary?.totalCost?.toFixed(2) || 0}</p>
                        </div>
                        <div className="card bg-success-50">
                            <p className="text-sm text-success-600 font-medium">Total Units</p>
                            <p className="text-3xl font-bold text-success-900">{summary?.totalUnits || 0} kWh</p>
                        </div>
                        <div className="card bg-purple-50">
                            <p className="text-sm text-purple-600 font-medium">Total Records</p>
                            <p className="text-3xl font-bold text-purple-900">{summary?.recordCount || 0}</p>
                        </div>
                    </div>

                    {/* Usage Chart */}
                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Usage Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="units" stroke="#0ea5e9" name="Units (kWh)" strokeWidth={2} />
                                <Line type="monotone" dataKey="cost" stroke="#22c55e" name="Cost (₹)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Billing History */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Billing History</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month/Year</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {billing.map((record) => (
                                        <tr key={record._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {new Date(2024, record.month - 1).toLocaleString('default', { month: 'long' })} {record.year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.unitsConsumed} kWh
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₹{record.ratePerUnit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                ₹{record.totalCost?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${record.isPaid
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {record.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageBilling;
