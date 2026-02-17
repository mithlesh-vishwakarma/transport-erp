import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import MaaVaishnoEntries from './pages/admin/MaaVaishnoEntries';
import JPCargoLR from './pages/admin/JPCargoLR';
import JPCargoInvoices from './pages/admin/JPCargoInvoices';
import Expenses from './pages/admin/Expenses';
import Reports from './pages/admin/Reports';
import Masters from './pages/admin/masters/Masters';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout><Home /></PublicLayout>} path="/" />
          <Route element={<PublicLayout><About /></PublicLayout>} path="/about" />
          <Route element={<PublicLayout><Contact /></PublicLayout>} path="/contact" />
          <Route element={<Login />} path="/login" />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={<AdminLayout><Dashboard /></AdminLayout>}
            />
            <Route
              path="/admin/entries"
              element={<AdminLayout><MaaVaishnoEntries /></AdminLayout>}
            />
            <Route
              path="/admin/lr"
              element={<AdminLayout><JPCargoLR /></AdminLayout>}
            />
            <Route
              path="/admin/invoices"
              element={<AdminLayout><JPCargoInvoices /></AdminLayout>}
            />
            <Route
              path="/admin/expenses"
              element={<AdminLayout><Expenses /></AdminLayout>}
            />
            <Route
              path="/admin/reports"
              element={<AdminLayout><Reports /></AdminLayout>}
            />
            <Route
              path="/admin/masters"
              element={<AdminLayout><Masters /></AdminLayout>}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
