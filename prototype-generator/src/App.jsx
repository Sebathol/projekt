import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrainstormingMode from './pages/BrainstormingMode';
import IdefinderMode from './pages/IdefinderMode';
import Completion from './pages/Completion';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import { useAppStore } from './store/appStore';
import './App.css';

function App() {
  const { toast } = useAppStore();

  return (
    <Router>
      <div className="app-container">
        {/* Routes */}
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Brainstorming Mode */}
          <Route
            path="/brainstorming"
            element={
              <ProtectedRoute>
                <BrainstormingMode />
              </ProtectedRoute>
            }
          />

          {/* Ideafinder Mode */}
          <Route
            path="/ideafinder"
            element={
              <ProtectedRoute>
                <IdefinderMode />
              </ProtectedRoute>
            }
          />

          {/* Completion Page */}
          <Route
            path="/completion"
            element={
              <ProtectedRoute>
                <Completion />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notification */}
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </Router>
  );
}

export default App;
