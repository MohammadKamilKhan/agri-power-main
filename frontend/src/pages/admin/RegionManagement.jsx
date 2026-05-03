import { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const RegionManagement = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        powerStatus: 'on',
        totalCapacity: '',
        currentLoad: ''
    });

    useEffect(() => {
        fetchRegions();
    }, []);

    const fetchRegions = async () => {
        try {
            const response = await api.get('/admin/regions');
            setRegions(response.data.regions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching regions:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRegion) {
                await api.put(`/admin/regions/${editingRegion._id}`, formData);
            } else {
                await api.post('/admin/regions', formData);
            }
            setShowModal(false);
            setEditingRegion(null);
            setFormData({ name: '', description: '', powerStatus: 'on', totalCapacity: '', currentLoad: '' });
            fetchRegions();
        } catch (error) {
            console.error('Error saving region:', error);
            alert(error.response?.data?.message || 'Error saving region');
        }
    };

    const handleEdit = (region) => {
        setEditingRegion(region);
        setFormData({
            name: region.name,
            description: region.description,
            powerStatus: region.powerStatus,
            totalCapacity: region.totalCapacity,
            currentLoad: region.currentLoad
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this region?')) return;

        try {
            await api.delete(`/admin/regions/${id}`);
            fetchRegions();
        } catch (error) {
            console.error('Error deleting region:', error);
            alert(error.response?.data?.message || 'Error deleting region');
        }
    };

    const togglePowerStatus = async (region) => {
        try {
            await api.put(`/admin/regions/${region._id}`, {
                ...region,
                powerStatus: region.powerStatus === 'on' ? 'off' : 'on'
            });
            fetchRegions();
        } catch (error) {
            console.error('Error updating power status:', error);
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
                        <h1 className="text-3xl font-bold text-gray-800">Region Management</h1>
                        <button
                            onClick={() => {
                                setEditingRegion(null);
                                setFormData({ name: '', description: '', powerStatus: 'on', totalCapacity: '', currentLoad: '' });
                                setShowModal(true);
                            }}
                            className="btn-primary"
                        >
                            + Add Region
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regions.map((region) => (
                            <div key={region._id} className="card">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-black">{region.name}</h3>
                                        <p className="text-sm text-gray-800">{region.description}</p>
                                    </div>
                                    <button
                                        onClick={() => togglePowerStatus(region)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${region.powerStatus === 'on'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {region.powerStatus === 'on' ? 'ON' : 'OFF'}
                                    </button>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-900">Customers:</span>
                                        <span className="font-semibold text-black">{region.customerCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-900">Capacity:</span>
                                        <span className="font-semibold text-black">{region.totalCapacity} kW</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-900">Current Load:</span>
                                        <span className="font-semibold text-black">{region.currentLoad} kW</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full"
                                            style={{ width: `${(region.currentLoad / region.totalCapacity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(region)} className="btn-primary flex-1">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(region._id)} className="btn-danger flex-1">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-4">
                                    {editingRegion ? 'Edit Region' : 'Add New Region'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="label">Region Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                    <div>
                                        <label className="label">Power Status</label>
                                        <select
                                            value={formData.powerStatus}
                                            onChange={(e) => setFormData({ ...formData, powerStatus: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="on">ON</option>
                                            <option value="off">OFF</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Total Capacity (kW)</label>
                                        <input
                                            type="number"
                                            value={formData.totalCapacity}
                                            onChange={(e) => setFormData({ ...formData, totalCapacity: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Current Load (kW)</label>
                                        <input
                                            type="number"
                                            value={formData.currentLoad}
                                            onChange={(e) => setFormData({ ...formData, currentLoad: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button type="submit" className="btn-primary flex-1">
                                            {editingRegion ? 'Update' : 'Create'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEditingRegion(null);
                                            }}
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

export default RegionManagement;
