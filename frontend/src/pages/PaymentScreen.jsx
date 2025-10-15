import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentScreen = () => {
  const location = useLocation();
  const { transaction } = location.state || {};

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl text-red-400">Error: Transaction Data Not Found</h1>
        <p className="text-gray-400 mt-2">Please return to the main page.</p>
        <Link to="/home" className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-green-400">Payment</h1>
        <p className="text-center text-gray-400 mb-6">Complete your payment to continue.</p>

        <div className="bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total Payment</p>
            <p className="text-3xl font-bold text-orange-400">
              Rp {transaction.amount.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-500">Please transfer to the following account:</p>
            <p className="text-xl font-semibold">Bank TRT - 112-233-4455</p>
            <p className="text-md">a/n The Rajin Titip</p>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">
              After making the transfer, upload your proof of payment to the "Transaction History" page.
            </p>
          </div>
        </div>
        <Link to={`/transaction/${transaction._id}`} className="mt-6 w-full text-center block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg">
            Pay Now
        </Link>
        <Link to="/home" className="mt-6 w-full text-center block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
          I'll Pay Later
        </Link>
      </div>
    </div>
  );
};

export default PaymentScreen;
