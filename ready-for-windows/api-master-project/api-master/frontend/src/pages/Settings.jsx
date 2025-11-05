import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <div className="card text-center py-12">
        <Cog6ToothIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Settings</h3>
        <p className="text-gray-600 mb-6">
          Manage your account settings and preferences
        </p>
      </div>
    </div>
  );
};

export default Settings;
