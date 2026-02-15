import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FiTrash2, FiShoppingBag, FiPlus, FiCheckCircle, FiCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Checkout = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(ShopContext);
    const navigate = useNavigate();
    
    // Address State
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '', city: '', state: '', zip: '', country: 'India', phone: '', isDefault: false
    });
    const [loadingAddr, setLoadingAddr] = useState(true);

    const totalAmount = cart.reduce(
        (total, item) => total + Math.round(item.price * (1 + item.discount / 100)) * item.quantity,
        0
    );

    // Fetch Addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                // Check if user is logged in (token exists) - relying on API interceptor
                const { data } = await api.get('/users/address');
                setAddresses(data);
                
                // Auto-select default or first
                const defaultAddr = data.find(a => a.isDefault);
                if (defaultAddr) setSelectedAddressId(defaultAddr._id);
                else if (data.length > 0) setSelectedAddressId(data[0]._id);
                
                setLoadingAddr(false);
            } catch (err) {
                console.warn("Failed to fetch addresses or user not logged in", err);
                setLoadingAddr(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/users/address', newAddress);
            setAddresses(data); // Backend returns updated list
            setIsAddressModalOpen(false);
            setNewAddress({ street: '', city: '', state: '', zip: '', country: 'India', phone: '', isDefault: false });
            
            // Auto Select the new one if it's the only one or default
            const added = data[data.length - 1]; // simplistic assumption
            if (data.length === 1 || newAddress.isDefault) {
                setSelectedAddressId(added._id);
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            alert('Please select a shipping address.');
            return;
        }

        // Validate Razorpay key is configured
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            alert('Payment gateway is not configured. Please contact support.');
            console.error('VITE_RAZORPAY_KEY_ID is not set in environment variables');
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // 1. Create Order on Backend
            const { data: order } = await api.post('/orders/razorpay', { amount: totalAmount });
            
            if (!order || !order.id) {
                throw new Error('Failed to create Razorpay order');
            }

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'Nirmal Handloom',
                description: 'Payment for your order',
                image: '/assets/logo.png',
                order_id: order.id,
                handler: async function (response) {
                    // Payment Successful
                    // Note: In production, verify the payment signature on backend
                    try {
                        // Optionally verify payment on backend
                        // await api.post('/orders/verify-payment', {
                        //     razorpay_order_id: response.razorpay_order_id,
                        //     razorpay_payment_id: response.razorpay_payment_id,
                        //     razorpay_signature: response.razorpay_signature,
                        // });
                        navigate(`/payment-success?payment_id=${response.razorpay_payment_id}`);
                    } catch (verifyError) {
                        console.error('Payment verification failed:', verifyError);
                        navigate(`/payment-success?payment_id=${response.razorpay_payment_id}`);
                    }
                },
                prefill: {
                    name: 'User Name', // Could fetch from context
                    email: 'user@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#D4AF37',
                },
                modal: {
                    ondismiss: function() {
                        console.log('Payment modal closed');
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                navigate('/payment-failure');
            });
            paymentObject.open();

        } catch (err) {
            console.error("Payment initiation failed", err);
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            alert(`Could not start payment: ${errorMessage}`);
        }
    };


    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-6 py-24 text-center text-gray-400 min-h-[60vh]">
                <FiShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-6">Your cart is empty.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-royal-gold text-royal-blue font-bold py-3 px-8 rounded-sm hover:bg-white transition-colors"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-24">
            <h1 className="text-4xl font-playfair text-off-white mb-12 text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Address & Items */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Address Section */}
                    <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-playfair text-off-white">Shipping Address</h3>
                            {addresses.length < 4 && (
                                <button 
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="flex items-center text-royal-gold text-sm hover:text-white transition-colors"
                                >
                                    <FiPlus className="mr-1" /> Add New
                                </button>
                            )}
                        </div>

                        {loadingAddr ? (
                            <div className="text-gray-400">Loading addresses...</div>
                        ) : addresses.length === 0 ? (
                            <div className="text-gray-400 text-sm">No saved addresses. Please add one.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr) => (
                                    <div 
                                        key={addr._id} 
                                        onClick={() => setSelectedAddressId(addr._id)}
                                        className={`cursor-pointer p-4 rounded-sm border relative transition-all ${
                                            selectedAddressId === addr._id 
                                            ? 'border-royal-gold bg-royal-gold/10' 
                                            : 'border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="absolute top-4 right-4 text-royal-gold">
                                            {selectedAddressId === addr._id ? <FiCheckCircle /> : <FiCircle className="text-gray-500" />}
                                        </div>
                                        <p className="font-bold text-off-white mb-1">{addr.street}</p>
                                        <p className="text-sm text-gray-400">{addr.city}, {addr.state} - {addr.zip}</p>
                                        <p className="text-sm text-gray-400">{addr.country}</p>
                                        <p className="text-sm text-gray-400 mt-2">Phone: {addr.phone}</p>
                                        {addr.isDefault && <span className="text-[10px] bg-royal-gold/20 text-royal-gold px-2 py-0.5 rounded mt-2 inline-block">Default</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4">
                         <h3 className="text-xl font-playfair text-off-white mb-4">Review Items</h3>
                         {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center bg-white/5 p-4 rounded-sm border border-white/10"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-sm"
                                />
                                <div className="ml-6 flex-1">
                                    <h3 className="text-base font-bold text-off-white">{item.name}</h3>
                                    <p className="text-xs text-royal-gold">{item.category?.name || (typeof item.category === 'string' ? item.category : 'Collection')}</p>
                                    <div className="mt-1 text-gray-300 text-sm">
                                        ₹{Math.round(item.price * (1 + item.discount / 100)).toLocaleString()} x {item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center bg-white/10 rounded-sm">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-2 py-1 text-off-white hover:bg-white/20"
                                        >
                                            -
                                        </button>
                                        <span className="px-2 text-off-white text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-2 py-1 text-off-white hover:bg-white/20"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-white/5 p-8 rounded-sm border border-white/10 h-fit sticky top-24">
                    <h3 className="text-xl font-playfair text-off-white mb-6">Order Summary</h3>
                    <div className="space-y-4 mb-6 text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal ({cart.reduce((a,c) => a + c.quantity, 0)} items)</span>
                            <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-400">Free</span>
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-royal-gold">
                            <span>Total</span>
                            <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={handlePayment}
                        disabled={!selectedAddressId}
                        className={`w-full font-bold py-4 rounded-sm transition-colors ${
                            selectedAddressId 
                            ? 'bg-royal-gold text-royal-blue hover:bg-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {selectedAddressId ? 'Proceed to Pay' : 'Select Address'}
                    </button>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        Secure payments via Razorpay.
                    </p>
                </div>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-royal-blue p-8 rounded-sm border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-playfair text-off-white mb-6">Add New Address</h2>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={newAddress.street}
                                onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                required
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-off-white focus:border-royal-gold outline-none"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-off-white focus:border-royal-gold outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-off-white focus:border-royal-gold outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Zip Code"
                                    value={newAddress.zip}
                                    onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-off-white focus:border-royal-gold outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={newAddress.country}
                                    onChange={e => setNewAddress({...newAddress, country: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-off-white focus:border-royal-gold outline-none"
                                />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newAddress.phone}
                                onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                required
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-off-white focus:border-royal-gold outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="defaultAddr"
                                    checked={newAddress.isDefault}
                                    onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                    className="accent-royal-gold w-4 h-4"
                                />
                                <label htmlFor="defaultAddr" className="text-gray-300 text-sm">Set as default address</label>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="flex-1 py-3 border border-white/20 text-off-white hover:bg-white/10 rounded-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-royal-gold text-royal-blue font-bold rounded-sm hover:bg-white"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
