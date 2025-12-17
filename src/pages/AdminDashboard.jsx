import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import api from '../utils/api';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            navigate('/login');
        } else if (user?.isAdmin) {
            fetchStats();
        }
    }, [user, loading, navigate]);

    const fetchStats = async () => {
        try {
            // Fetching all data to count - optimized in real app with specific endpoints
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                api.get('/users?isAdmin=true'), // Assuming GET /users returns list for admin
                api.get('/products?limit=1000'), // Assuming fetching all products
                api.get('/orders'), // Assuming GET /orders returns all orders for admin
            ]);
            
            // Calculate revenue
            const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

            setStats({
                users: usersRes.data.length,
                products: productsRes.data.products ? productsRes.data.products.length : productsRes.data.length, // Handle pagination response vs list
                orders: ordersRes.data.length,
                revenue: totalRevenue
            });
            setIsLoadingStats(false);
        } catch (error) {
            console.error("Error fetching stats", error);
            setIsLoadingStats(false);
        }
    };

    if (loading || isLoadingStats) return <div className="text-white text-center py-20">Loading Dashboard...</div>;

    const cards = [
        { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <FiDollarSign size={24} />, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
        { title: 'Total Orders', value: stats.orders, icon: <FiShoppingBag size={24} />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
        { title: 'Total Products', value: stats.products, icon: <FiBox size={24} />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
        { title: 'Total Users', value: stats.users, icon: <FiUsers size={24} />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    ];

    return (
        <AdminLayout>
            <h1 className="text-3xl font-playfair text-off-white mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className={`p-6 rounded-sm border ${card.color} backdrop-blur-sm`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm uppercase tracking-wide font-bold opacity-80">{card.title}</h3>
                            <div className="p-2 rounded-full bg-white/5">{card.icon}</div>
                        </div>
                        <p className="text-3xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Placeholder for recent activity or charts */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-off-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => navigate('/admin/products')} className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-royal-gold transition-colors text-left group">
                        <h3 className="text-lg font-bold text-royal-gold group-hover:text-white transition-colors mb-2">Manage Products</h3>
                        <p className="text-sm text-gray-400">Add, edit, or remove products from your store.</p>
                    </button>
                    <button onClick={() => navigate('/admin/categories')} className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-royal-gold transition-colors text-left group">
                        <h3 className="text-lg font-bold text-royal-gold group-hover:text-white transition-colors mb-2">Manage Categories</h3>
                        <p className="text-sm text-gray-400">Organize your products into categories.</p>
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-royal-gold transition-colors text-left group">
                        <h3 className="text-lg font-bold text-royal-gold group-hover:text-white transition-colors mb-2">View Orders</h3>
                        <p className="text-sm text-gray-400">Track and manage customer orders.</p>
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
