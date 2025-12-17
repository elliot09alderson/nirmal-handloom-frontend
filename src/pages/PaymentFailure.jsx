import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const PaymentFailure = () => {
    return (
        <div className="container mx-auto px-6 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <FiAlertCircle size={64} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-playfair text-off-white mb-4">Payment Failed</h1>
            <p className="text-gray-300 mb-8">
                Something went wrong with your transaction. Please try again.
            </p>
            <div className="flex space-x-4">
                <Link
                    to="/checkout"
                    className="bg-royal-gold text-royal-blue font-bold py-3 px-8 rounded-sm hover:bg-white transition-colors"
                >
                    Try Again
                </Link>
                <Link
                    to="/"
                    className="border border-white/20 text-off-white py-3 px-8 rounded-sm hover:bg-white/10 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default PaymentFailure;
