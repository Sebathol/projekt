import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BrainstormingMode from './pages/BrainstormingMode';
import IdefinderMode from './pages/IdefinderMode';
import Completion from './pages/Completion';
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
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Brainstorming Mode */}
          <Route path="/brainstorming" element={<BrainstormingMode />} />

          {/* Ideafinder Mode */}
          <Route path="/ideafinder" element={<IdefinderMode />} />

          {/* Completion Page */}
          <Route path="/completion" element={<Completion />} />

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
