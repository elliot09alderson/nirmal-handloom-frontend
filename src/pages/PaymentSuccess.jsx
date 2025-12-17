import React, { useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const { cart, removeFromCart } = useContext(ShopContext);

    // Clear cart on successful payment (simplified logic)
    useEffect(() => {
        if (cart.length > 0) {
            cart.forEach(item => removeFromCart(item.id));
        }
    }, []);

    return (
        <div className="container mx-auto px-6 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <FiCheckCircle size={64} className="text-green-500 mb-6" />
            <h1 className="text-4xl font-playfair text-off-white mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-2">Thank you for your purchase.</p>
            {paymentId && (
                <p className="text-royal-gold font-mono mb-8">Transaction ID: {paymentId}</p>
            )}
            <Link
                to="/"
                className="bg-royal-gold text-royal-blue font-bold py-3 px-8 rounded-sm hover:bg-white transition-colors"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default PaymentSuccess;
