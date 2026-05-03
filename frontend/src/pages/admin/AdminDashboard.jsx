import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [regionStats, setRegionStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data.stats);
            setRegionStats(response.data.regionStats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-100 text-sm">Total Regions</p>
                                    <p className="text-3xl font-bold mt-2">{stats?.totalRegions || 0}</p>
                                </div>
                                <div className="text-5xl opacity-50">🗺️</div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-success-100 text-sm">Total Customers</p>
                                    <p className="text-3xl font-bold mt-2">{stats?.totalCustomers || 0}</p>
                                </div>
                                <div className="text-5xl opacity-50">👥</div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm">Pending Complaints</p>
                                    <p className="text-3xl font-bold mt-2">{stats?.pendingComplaints || 0}</p>
                                </div>
                                <div className="text-5xl opacity-50">📝</div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Monthly Revenue</p>
                                    <p className="text-3xl font-bold mt-2">₹{stats?.monthlyRevenue?.toFixed(2) || 0}</p>
                                </div>
                                <div className="text-5xl opacity-50">💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Region Statistics Chart */}
                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Region-wise Load Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={regionStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="currentLoad" fill="#0ea5e9" name="Current Load (kW)" />
                                <Bar dataKey="totalCapacity" fill="#22c55e" name="Total Capacity (kW)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Region Status Table */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Region Status</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Region
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Power Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customers
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Load
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {regionStats.map((region) => (
                                        <tr key={region._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                                {region.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${region.powerStatus === 'on'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {region.powerStatus === 'on' ? 'ON' : 'OFF'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {region.customerCount || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {region.currentLoad} / {region.totalCapacity} kW
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

export default AdminDashboard;
