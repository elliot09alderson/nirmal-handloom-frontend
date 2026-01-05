import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiPackage, FiCalendar, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-royal-gold">Loading orders...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
             <h2 className="text-2xl font-playfair text-off-white mb-6">Order History</h2>
            
             <div className="space-y-4">
                {orders.map((order) => (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        key={order._id} 
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-royal-gold/30 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-4 mb-4">
                             <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                                <p className="font-mono text-royal-gold">#{order._id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                <div className="flex items-center gap-2 text-white">
                                    <FiCalendar className="text-gray-500" />
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p>
                                <p className="font-bold text-white text-lg">₹{order.totalPrice}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                    order.isDelivered ? 'bg-green-500/20 text-green-400' :
                                    order.isPaid ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-orange-500/20 text-orange-400'
                                }`}>
                                    {order.isDelivered ? <FiCheckCircle /> : order.isPaid ? <FiTruck /> : <FiPackage />}
                                    {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-3">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                    <div className="w-12 h-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.qty} x ₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
                
                {orders.length === 0 && (
                     <div className="text-center py-12 text-gray-500">
                        You have no orders yet.
                    </div>
                )}
             </div>
        </motion.div>
    );
};

export default MyOrders;
