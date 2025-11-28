/**
 * LoadingSpinner Component
 */
export default function LoadingSpinner({ message = 'Wird geladen...', tips = [] }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#667eea] rounded-full animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{message}</h2>
      {tips.length > 0 && (
        <p className="text-gray-500 text-sm italic">{tips[0]}</p>
      )}
    </div>
  );
}
