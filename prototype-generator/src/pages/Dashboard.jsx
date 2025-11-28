import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import authService from '../services/authService';
import projectService from '../services/projectService';
import quotaService from '../services/quotaService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { setToast, toast } = useAppStore();
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load user
      const userData = authService.getCurrentUser();
      setUser(userData);

      // Load quota
      const quotaData = await quotaService.getQuota();
      setQuota(quotaData);

      // Load projects
      const projectsData = await projectService.getProjects();
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error('Load dashboard error:', error);
      showToast(error.message || 'Fehler beim Laden der Daten', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      showToast('✅ Erfolgreich abgemeldet', 'success');
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      showToast('Fehler beim Abmelden', 'error');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Möchten Sie dieses Projekt wirklich löschen?')) return;

    try {
      await projectService.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      showToast('✅ Projekt gelöscht', 'success');
    } catch (error) {
      showToast('Fehler beim Löschen', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Dashboard wird geladen..." />;
  }

  const quotaStatus = quota ? quotaService.getQuotaStatus(quota) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-white/80 mt-1">Willkommen zurück, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
          >
            Abmelden
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Quota Card */}
        {quotaStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Quota-Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tokens */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">API-Token Verbrauch</span>
                  <span className="text-sm font-bold text-[#667eea]">{quotaStatus.tokens.percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      quotaStatus.tokens.status === 'ok'
                        ? 'bg-[#667eea]'
                        : quotaStatus.tokens.status === 'warning'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#ef4444]'
                    }`}
                    style={{ width: `${Math.min(quotaStatus.tokens.percent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {quotaStatus.tokens.used.toLocaleString()} / {quotaStatus.tokens.limit.toLocaleString()} Tokens
                </p>
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Monats-Budget</span>
                  <span className="text-sm font-bold text-[#667eea]">{quotaStatus.budget.percent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      quotaStatus.budget.status === 'ok'
                        ? 'bg-[#10b981]'
                        : quotaStatus.budget.status === 'warning'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#ef4444]'
                    }`}
                    style={{ width: `${Math.min(quotaStatus.budget.percent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ${quotaStatus.budget.spent.toFixed(2)} / ${quotaStatus.budget.limit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">📁 Meine Projekte</h2>
            <Button onClick={() => navigate('/')}>Neues Projekt</Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Noch keine Projekte erstellt</p>
              <Button onClick={() => navigate('/')}>Projekt starten</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.mode === 'brainstorming' ? '🧠 Brainstorming' : '💡 Ideafinder'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description || project.topic}</p>

                  <div className="text-xs text-gray-400 mb-4">
                    Erstellt: {new Date(project.createdAt).toLocaleDateString('de-DE')}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          project.mode === 'brainstorming' ? '/brainstorming' : '/ideafinder',
                          { state: { projectId: project.id } }
                        )
                      }
                      className="flex-1 px-3 py-2 bg-[#667eea] text-white text-sm rounded hover:opacity-90 transition-opacity"
                    >
                      Öffnen
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
