import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { FiCheck, FiX } from 'react-icons/fi';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.orders || data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders", error);
            setLoading(false);
        }
    };

    const handleDeliver = async (id) => {
        try {
            await api.put(`/orders/${id}/deliver`);
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-playfair text-off-white mb-8">Orders</h1>

            {loading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="bg-white/5 rounded-sm border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-off-white">
                        <thead className="bg-white/10 text-royal-gold uppercase text-sm">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Paid</th>
                                <th className="p-4">Delivered</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5">
                                    <td className="p-4 text-xs font-mono opacity-70">{order._id.substring(20)}...</td>
                                    <td className="p-4">{order.user?.name || 'Guest'}</td>
                                    <td className="p-4 text-sm">{order.createdAt.substring(0, 10)}</td>
                                    <td className="p-4">₹{order.totalPrice}</td>
                                    <td className="p-4">
                                        {order.isPaid ? (
                                            <span className="text-green-400 flex items-center gap-1"><FiCheck /> {order.paidAt?.substring(0, 10)}</span>
                                        ) : (
                                            <span className="text-red-400 flex items-center gap-1"><FiX /> Not Paid</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {order.isDelivered ? (
                                            <span className="text-green-400 flex items-center gap-1"><FiCheck /> {order.deliveredAt?.substring(0, 10)}</span>
                                        ) : (
                                            <span className="text-red-400 flex items-center gap-1"><FiX /> Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {!order.isDelivered && (
                                            <button 
                                                onClick={() => handleDeliver(order._id)}
                                                className="bg-royal-gold text-royal-blue text-xs font-bold px-3 py-1 rounded-sm hover:bg-white"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
