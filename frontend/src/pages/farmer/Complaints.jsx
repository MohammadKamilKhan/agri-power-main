import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/farmer/complaints');
            setComplaints(response.data.complaints);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/farmer/complaints', formData);
            setShowModal(false);
            setFormData({ subject: '', description: '', priority: 'medium' });
            fetchComplaints();
        } catch (error) {
            console.error('Error creating complaint:', error);
            alert('Error creating complaint');
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
                        <h1 className="text-3xl font-bold text-gray-800">My Complaints</h1>
                        <button onClick={() => setShowModal(true)} className="btn-primary">
                            + Submit Complaint
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <div key={complaint._id} className="card">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">{complaint.subject}</h3>
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
                                            <p className="text-sm text-blue-900">
                                                <strong>Admin Response:</strong> {complaint.adminNotes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        {complaint.resolvedAt && (
                                            <span>Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 card text-center py-12">
                                <p className="text-gray-600">No complaints submitted yet.</p>
                            </div>
                        )}
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-4">Submit Complaint</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="label">Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button type="submit" className="btn-primary flex-1">Submit</button>
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

export default Complaints;
