import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const adminLinks = [
        { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { to: '/admin/regions', icon: '🗺️', label: 'Regions' },
        { to: '/admin/customers', icon: '👥', label: 'Customers' },
        { to: '/admin/schedules', icon: '📅', label: 'Schedules' },
        { to: '/admin/usage-entry', icon: '⚡', label: 'Add Usage' },
        { to: '/admin/billing', icon: '💰', label: 'Billing' },
        { to: '/admin/complaints', icon: '📝', label: 'Complaints' },
        { to: '/admin/logs', icon: '📋', label: 'Activity Logs' },
    ];

    const farmerLinks = [
        { to: '/farmer/dashboard', icon: '📊', label: 'Dashboard' },
        { to: '/farmer/schedules', icon: '📅', label: 'Power Schedule' },
        { to: '/farmer/billing', icon: '💰', label: 'Usage & Billing' },
        { to: '/farmer/complaints', icon: '📝', label: 'Complaints' },
    ];

    const links = user?.role === 'admin' ? adminLinks : farmerLinks;

    return (
        <div className="w-64 bg-gray-800 min-h-screen text-white">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-8">
                    {user?.role === 'admin' ? 'Admin Panel' : 'Farmer Portal'}
                </h2>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`
                            }
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
