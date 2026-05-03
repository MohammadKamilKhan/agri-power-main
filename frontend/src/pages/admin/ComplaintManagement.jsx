import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, [filter]);

    const fetchComplaints = async () => {
        try {
            const url = filter === 'all' ? '/admin/complaints' : `/admin/complaints?status=${filter}`;
            const response = await api.get(url);
            setComplaints(response.data.complaints);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setLoading(false);
        }
    };

    const updateComplaint = async (id, status, adminNotes) => {
        try {
            await api.put(`/admin/complaints/${id}`, { status, adminNotes });
            setSelectedComplaint(null);
            fetchComplaints();
        } catch (error) {
            console.error('Error updating complaint:', error);
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Complaint Management</h1>

                    <div className="card mb-6">
                        <div className="flex space-x-2">
                            {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg font-medium ${filter === status
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {complaints.map((complaint) => (
                            <div key={complaint._id} className="card">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{complaint.subject}</h3>
                                        <p className="text-sm text-gray-600">{complaint.customer?.name}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {complaint.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                complaint.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4">{complaint.description}</p>

                                {complaint.adminNotes && (
                                    <div className="bg-blue-50 p-3 rounded mb-4">
                                        <p className="text-sm text-blue-900"><strong>Admin Notes:</strong> {complaint.adminNotes}</p>
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 mb-4">
                                    Created: {new Date(complaint.createdAt).toLocaleString()}
                                </div>

                                <button
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className="btn-primary w-full"
                                >
                                    Update Status
                                </button>
                            </div>
                        ))}
                    </div>

                    {selectedComplaint && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-4">Update Complaint</h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const status = e.target.status.value;
                                    const adminNotes = e.target.adminNotes.value;
                                    updateComplaint(selectedComplaint._id, status, adminNotes);
                                }} className="space-y-4">
                                    <div>
                                        <label className="label">Status</label>
                                        <select name="status" defaultValue={selectedComplaint.status} className="input-field">
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Admin Notes</label>
                                        <textarea
                                            name="adminNotes"
                                            defaultValue={selectedComplaint.adminNotes}
                                            className="input-field"
                                            rows="4"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button type="submit" className="btn-primary flex-1">Update</button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedComplaint(null)}
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

export default ComplaintManagement;
