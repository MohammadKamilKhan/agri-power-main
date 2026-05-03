import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const BillingReports = () => {
    const [billing, setBilling] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchBilling();
    }, [month, year]);

    const fetchBilling = async () => {
        try {
            const response = await api.get(`/admin/billing?month=${month}&year=${year}`);
            setBilling(response.data.billing);
            setSummary(response.data.summary);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching billing:', error);
            setLoading(false);
        }
    };

    const chartData = billing.slice(0, 10).map(record => ({
        name: record.customer?.name || 'Unknown',
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Billing Reports</h1>

                    <div className="card mb-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div>
                                <label className="label">Month</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                    className="input-field"
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Year</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="input-field"
                                >
                                    {[2024, 2025, 2026].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-primary-50 p-4 rounded-lg">
                                <p className="text-sm text-primary-600 font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold text-primary-900">₹{summary?.totalRevenue?.toFixed(2) || 0}</p>
                            </div>
                            <div className="bg-success-50 p-4 rounded-lg">
                                <p className="text-sm text-success-600 font-medium">Total Units</p>
                                <p className="text-2xl font-bold text-success-900">{summary?.totalUnits || 0} kWh</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-600 font-medium">Total Customers</p>
                                <p className="text-2xl font-bold text-purple-900">{summary?.totalCustomers || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Top 10 Consumers</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="units" fill="#0ea5e9" name="Units (kWh)" />
                                <Bar dataKey="cost" fill="#22c55e" name="Cost (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Billing Details</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
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
                                                {record.customer?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {record.region?.name || 'N/A'}
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

export default BillingReports;
