import React from 'react';
import { XCircle, RefreshCw, Home } from 'lucide-react';

function PaymentFailed() {
  const handleRetry = () => {
    // Add your retry logic here
    console.log('Retrying payment...');
  };

  const handleGoHome = () => {
    // Add navigation to home
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Payment Failed
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-2">
          We're sorry, but your payment could not be processed.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Please check your payment details and try again.
        </p>

        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">
            <strong>Possible reasons:</strong>
          </p>
          <ul className="text-red-600 text-sm text-left mt-2 space-y-1">
            <li>• Insufficient funds</li>
            <li>• Invalid card details</li>
            <li>• Network connection issue</li>
            <li>• Bank declined the transaction</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Support Text */}
        <p className="text-gray-500 text-xs mt-6">
          Need help?{' '}
          <a href="mailto:support@example.com" className="text-red-500 hover:text-red-600 underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

export default PaymentFailed;