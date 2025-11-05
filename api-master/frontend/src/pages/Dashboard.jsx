import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import useApiKeysStore from '../stores/apiKeysStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { apiKeys, fetchApiKeys, loading } = useApiKeysStore();
  const [stats, setStats] = useState({
    totalApis: 0,
    totalRequests: 0,
    activeApis: 0,
    requestsToday: 0,
  });

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  useEffect(() => {
    if (apiKeys.length > 0) {
      const totalRequests = apiKeys.reduce(
        (sum, key) => sum + (key.totalRequests || 0),
        0
      );
      const requestsToday = apiKeys.reduce(
        (sum, key) => sum + (key.requestsToday || 0),
        0
      );
      const activeApis = apiKeys.filter((key) => key.isActive).length;

      setStats({
        totalApis: apiKeys.length,
        totalRequests,
        activeApis,
        requestsToday,
      });
    }
  }, [apiKeys]);

  const statCards = [
    {
      name: 'Total APIs',
      value: stats.totalApis,
      icon: KeyIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Active APIs',
      value: stats.activeApis,
      icon: BoltIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Requests',
      value: stats.totalRequests.toLocaleString(),
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Requests Today',
      value: stats.requestsToday.toLocaleString(),
      icon: ShieldCheckIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your APIs today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/api-keys"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <KeyIcon className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add New API</h3>
            <p className="text-sm text-gray-600 mt-1">
              Start managing a new API key
            </p>
          </Link>
          <Link
            to="/dashboard/teams"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <svg
              className="w-8 h-8 text-primary-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900">Invite Team Member</h3>
            <p className="text-sm text-gray-600 mt-1">
              Collaborate with your team
            </p>
          </Link>
          <Link
            to="/dashboard/subscription"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <svg
              className="w-8 h-8 text-primary-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="font-semibold text-gray-900">Upgrade Plan</h3>
            <p className="text-sm text-gray-600 mt-1">
              Unlock more features
            </p>
          </Link>
        </div>
      </div>

      {/* Recent API Keys */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent API Keys</h2>
          <Link
            to="/dashboard/api-keys"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No API keys yet</p>
            <Link to="/dashboard/api-keys" className="btn btn-primary">
              Add Your First API
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.slice(0, 5).map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <KeyIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {apiKey.apiName}
                    </h3>
                    <p className="text-sm text-gray-600">{apiKey.apiProvider}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {apiKey.requestsToday || 0} requests today
                    </p>
                    <p className="text-xs text-gray-600">
                      Environment: {apiKey.environment}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      apiKey.isActive ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
