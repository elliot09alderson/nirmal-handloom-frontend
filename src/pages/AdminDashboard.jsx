import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import api from '../utils/api';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiActivity, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0,
        recentOrders: []
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Dummy data for charts (replace with real API data if available)
    const [revenueData] = useState([
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5500 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 7000 },
        { name: 'Jun', revenue: 8500 },
        { name: 'Jul', revenue: 10000 },
    ]);

    const [statusData, setStatusData] = useState([
        { name: 'Pending', value: 0 },
        { name: 'Processing', value: 0 },
        { name: 'Shipped', value: 0 },
        { name: 'Delivered', value: 0 },
    ]);

    const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'];

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/login');
        } else if (user?.role === 'admin') {
            fetchStats();
        }
    }, [user, loading, navigate]);

    const fetchStats = async () => {
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                api.get('/users?isAdmin=true'),
                api.get('/products?limit=1000&showAll=true'), // Assuming backend supports showAll
                api.get('/orders'),
            ]);
            
            const orders = ordersRes.data;
            const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
            
            // Calculate status distribution
            const statusCounts = {
                Pending: 0,
                Processing: 0,
                Shipped: 0,
                Delivered: 0
            };
            orders.forEach(order => {
                // Map logical status (if not explicit in your model, infer or use what exists)
                // Assuming order model has 'status' or boolean flags like isDelivered
                if (order.isDelivered) statusCounts.Delivered++;
                else if (order.isPaid) statusCounts.Processing++; // Simplified logic
                else statusCounts.Pending++;
            });

            // Update pie chart data
            setStatusData([
                { name: 'Pending', value: statusCounts.Pending },
                { name: 'To Ship', value: statusCounts.Processing }, // Renamed for clarity
                { name: 'Delivered', value: statusCounts.Delivered },
            ]);

            setStats({
                users: usersRes.data.length,
                products: productsRes.data.products ? productsRes.data.products.length : productsRes.data.length,
                orders: orders.length,
                revenue: totalRevenue,
                recentOrders: orders.slice(0, 5) // Last 5 orders
            });
            setIsLoadingStats(false);
        } catch (error) {
            console.error("Error fetching stats", error);
            setIsLoadingStats(false);
        }
    };

    if (loading || isLoadingStats) return (
        <AdminLayout>
             <div className="flex h-full justify-center items-center text-royal-gold">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-gold"></div>
            </div>
        </AdminLayout>
    );

    const cards = [
        { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <FiDollarSign size={24} />, color: 'from-green-500/20 to-emerald-500/5 border-green-500/30 text-green-400', trend: '+12.5%' },
        { title: 'Total Orders', value: stats.orders, icon: <FiShoppingBag size={24} />, color: 'from-blue-500/20 to-cyan-500/5 border-blue-500/30 text-blue-400', trend: '+5.2%' },
        { title: 'Total Products', value: stats.products, icon: <FiBox size={24} />, color: 'from-purple-500/20 to-fuchsia-500/5 border-purple-500/30 text-purple-400', trend: '+2' },
        { title: 'Total Users', value: stats.users, icon: <FiUsers size={24} />, color: 'from-orange-500/20 to-amber-500/5 border-orange-500/30 text-orange-400', trend: '+8.1%' },
    ];

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-playfair text-off-white mb-2">Dashboard Overview</h1>
                    <p className="text-gray-400 font-lato">Welcome back, {user?.name}</p>
                </div>
                <div className="text-right hidden sm:block">
                     <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        className={`p-6 rounded-2xl border bg-gradient-to-br ${card.color} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-md shadow-inner">{card.icon}</div>
                             <span className="flex items-center text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-white/50">
                                <FiActivity className="mr-1" /> {card.trend}
                             </span>
                        </div>
                        <h3 className="text-sm uppercase tracking-wider font-bold opacity-70 mb-1">{card.title}</h3>
                        <p className="text-3xl font-playfair font-bold text-white">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                    <h3 className="text-xl font-playfair text-royal-gold mb-6">Revenue Analytics</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#D4AF37' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Chart */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                    <h3 className="text-xl font-playfair text-royal-gold mb-6">Order Status</h3>
                    <div className="h-80 w-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                    <h3 className="text-xl font-playfair text-royal-gold mb-6">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                             <thead className="text-xs uppercase bg-white/5 text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {stats.recentOrders.length > 0 ? stats.recentOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs">{order._id.substring(0, 8)}...</td>
                                        <td className="px-4 py-3">{order.user ? order.user.name : 'Unknown'}</td>
                                        <td className="px-4 py-3 font-bold text-white">₹{order.totalPrice}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-500/20 text-green-400' : order.isPaid ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center">No recent orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-center">
                    <h3 className="text-xl font-playfair text-royal-gold mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => navigate('/admin/products')} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-royal-gold hover:text-royal-blue hover:border-royal-gold transition-all duration-300 text-center group">
                            <FiBox size={24} className="mx-auto mb-2 text-royal-gold group-hover:text-royal-blue" />
                            <span className="font-bold">Add Product</span>
                        </button>
                        <button onClick={() => navigate('/admin/categories')} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-royal-gold hover:text-royal-blue hover:border-royal-gold transition-all duration-300 text-center group">
                            <FiActivity size={24} className="mx-auto mb-2 text-royal-gold group-hover:text-royal-blue" />
                            <span className="font-bold">Categories</span>
                        </button>
                         <button onClick={() => navigate('/admin/users')} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-royal-gold hover:text-royal-blue hover:border-royal-gold transition-all duration-300 text-center group">
                            <FiUsers size={24} className="mx-auto mb-2 text-royal-gold group-hover:text-royal-blue" />
                            <span className="font-bold">Users</span>
                        </button>
                        <button onClick={() => navigate('/admin/orders')} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-royal-gold hover:text-royal-blue hover:border-royal-gold transition-all duration-300 text-center group">
                            <FiShoppingBag size={24} className="mx-auto mb-2 text-royal-gold group-hover:text-royal-blue" />
                            <span className="font-bold">Orders</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
