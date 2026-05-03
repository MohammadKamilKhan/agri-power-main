import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RegionManagement from './pages/admin/RegionManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import BillingReports from './pages/admin/BillingReports';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import ActivityLogs from './pages/admin/ActivityLogs';
import UsageEntry from './pages/admin/UsageEntry';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import UsageBilling from './pages/farmer/UsageBilling';
import Complaints from './pages/farmer/Complaints';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/regions"
            element={
              <ProtectedRoute requireAdmin>
                <RegionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute requireAdmin>
                <CustomerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <ProtectedRoute requireAdmin>
                <ScheduleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usage-entry"
            element={
              <ProtectedRoute requireAdmin>
                <UsageEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <ProtectedRoute requireAdmin>
                <BillingReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute requireAdmin>
                <ComplaintManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute requireAdmin>
                <ActivityLogs />
              </ProtectedRoute>
            }
          />

          {/* Farmer Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute requireFarmer>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/schedules"
            element={
              <ProtectedRoute requireFarmer>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/billing"
            element={
              <ProtectedRoute requireFarmer>
                <UsageBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/complaints"
            element={
              <ProtectedRoute requireFarmer>
                <Complaints />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
