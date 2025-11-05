import { UsersIcon } from '@heroicons/react/24/outline';

const Teams = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Teams</h1>
      <div className="card text-center py-12">
        <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Management</h3>
        <p className="text-gray-600 mb-6">
          Collaborate with your team (Available in Ultimate and Enterprise plans)
        </p>
      </div>
    </div>
  );
};

export default Teams;
