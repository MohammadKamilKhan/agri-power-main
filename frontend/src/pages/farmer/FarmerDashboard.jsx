import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const FarmerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/farmer/dashboard');
            setDashboardData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
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

    if (!dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Unable to load dashboard data</p>
                </div>
            </div>
        );
    }

    const { farmer, schedules, currentUsage, pendingComplaints } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {farmer.name}!</h1>
                    <p className="text-gray-600 mb-8">
                        Region: {farmer.region?.name || 'Not Assigned Yet'}
                    </p>

                    {!farmer.region && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                            <p className="font-medium">⚠️ No Region Assigned</p>
                            <p className="text-sm mt-1">Please contact the administrator to assign you to a region.</p>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-100 text-sm">Power Status</p>
                                    <p className="text-3xl font-bold mt-2">
                                        {farmer.region?.powerStatus === 'on' ? 'ON' : farmer.region?.powerStatus === 'off' ? 'OFF' : 'N/A'}
                                    </p>
                                </div>
                                <div className="text-5xl opacity-50">⚡</div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-success-100 text-sm">Current Month Usage</p>
                                    <p className="text-3xl font-bold mt-2">{currentUsage?.unitsConsumed || 0} kWh</p>
                                </div>
                                <div className="text-5xl opacity-50">📊</div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Current Bill</p>
                                    <p className="text-3xl font-bold mt-2">₹{currentUsage?.totalCost?.toFixed(2) || 0}</p>
                                </div>
                                <div className="text-5xl opacity-50">💰</div>
                            </div>
                        </div>
                    </div>


                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <a href="/farmer/billing" className="block w-full btn-primary text-center">
                                    View Billing History
                                </a>
                                <a href="/farmer/complaints" className="block w-full btn-secondary text-center">
                                    Submit Complaint
                                </a>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Complaints</h3>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-primary-600">{pendingComplaints}</p>
                                <p className="text-gray-600 mt-2">Complaints awaiting resolution</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
