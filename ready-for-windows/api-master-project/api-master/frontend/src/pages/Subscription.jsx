import { CreditCardIcon } from '@heroicons/react/24/outline';

const Subscription = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription</h1>
      <div className="card text-center py-12">
        <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Subscription</h3>
        <p className="text-gray-600 mb-6">
          View and manage your subscription plan
        </p>
      </div>
    </div>
  );
};

export default Subscription;
