import { useEffect, useState } from 'react';
import { PlusIcon, KeyIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useApiKeysStore from '../stores/apiKeysStore';

const ApiKeys = () => {
  const { apiKeys, fetchApiKeys, createApiKey, deleteApiKey, switchEnvironment, rotateProxyKey, loading } = useApiKeysStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const onSubmit = async (data) => {
    const result = await createApiKey(data);
    if (result.success) {
      toast.success('API Key created successfully!');
      reset();
      setShowAddModal(false);
    } else {
      toast.error(result.error || 'Failed to create API key');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      const result = await deleteApiKey(id);
      if (result.success) {
        toast.success('API Key deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete API key');
      }
    }
  };

  const handleSwitchEnvironment = async (id, currentEnv) => {
    const newEnv = currentEnv === 'test' ? 'production' : 'test';
    const result = await switchEnvironment(id, newEnv);
    if (result.success) {
      toast.success(`Switched to ${newEnv} environment`);
    } else {
      toast.error(result.error || 'Failed to switch environment');
    }
  };

  const handleRotate = async (id) => {
    if (confirm('Rotate proxy key? Your old proxy key will no longer work.')) {
      const result = await rotateProxyKey(id);
      if (result.success) {
        toast.success('Proxy key rotated successfully');
      } else {
        toast.error(result.error || 'Failed to rotate proxy key');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-2">Manage your API keys securely</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add API Key
        </button>
      </div>

      {loading && apiKeys.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="card text-center py-12">
          <KeyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No API keys yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first API key</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            Add Your First API
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <KeyIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{apiKey.apiName}</h3>
                    <p className="text-sm text-gray-600">{apiKey.apiProvider}</p>
                  </div>
                </div>
                <span className={`badge ${apiKey.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {apiKey.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Proxy API Key</label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm">
                      {apiKey.proxyKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKey.proxyKey)}
                      className="btn btn-secondary px-3 py-2"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Environment:</span>
                    <span className={`ml-2 badge ${apiKey.environment === 'production' ? 'badge-success' : 'badge-warning'}`}>
                      {apiKey.environment}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Requests Today:</span>
                    <span className="ml-2 font-semibold">{apiKey.requestsToday || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Requests:</span>
                    <span className="ml-2 font-semibold">{apiKey.totalRequests || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSwitchEnvironment(apiKey.id, apiKey.environment)}
                  className="btn btn-secondary text-sm"
                >
                  Switch to {apiKey.environment === 'test' ? 'Production' : 'Test'}
                </button>
                <button
                  onClick={() => handleRotate(apiKey.id)}
                  className="btn btn-secondary text-sm"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-1" />
                  Rotate Key
                </button>
                <button
                  onClick={() => handleDelete(apiKey.id)}
                  className="btn btn-danger text-sm ml-auto"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add API Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New API Key</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Name *
                    </label>
                    <input
                      {...register('apiName', { required: 'API name is required' })}
                      className={`input ${errors.apiName ? 'input-error' : ''}`}
                      placeholder="OpenAI API"
                    />
                    {errors.apiName && <p className="mt-1 text-sm text-red-600">{errors.apiName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Provider *
                    </label>
                    <input
                      {...register('apiProvider', { required: 'Provider is required' })}
                      className={`input ${errors.apiProvider ? 'input-error' : ''}`}
                      placeholder="OpenAI"
                    />
                    {errors.apiProvider && <p className="mt-1 text-sm text-red-600">{errors.apiProvider.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original API Key (Production) *
                  </label>
                  <input
                    {...register('originalKey', { required: 'API key is required' })}
                    type="password"
                    className={`input font-mono ${errors.originalKey ? 'input-error' : ''}`}
                    placeholder="sk-..."
                  />
                  <p className="mt-1 text-xs text-gray-500">This will be encrypted and stored securely</p>
                  {errors.originalKey && <p className="mt-1 text-sm text-red-600">{errors.originalKey.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test API Key (Optional)
                  </label>
                  <input
                    {...register('testKey')}
                    type="password"
                    className="input font-mono"
                    placeholder="sk-test-..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Endpoint (Optional)
                  </label>
                  <input
                    {...register('apiEndpoint')}
                    className="input"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Version (Optional)
                    </label>
                    <input
                      {...register('apiVersion')}
                      className="input"
                      placeholder="v1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (Optional)
                    </label>
                    <input
                      {...register('tags')}
                      className="input"
                      placeholder="ai, gpt, chatbot"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input"
                    placeholder="Additional notes about this API..."
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                    {loading ? 'Creating...' : 'Create API Key'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setShowAddModal(false);
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeys;
