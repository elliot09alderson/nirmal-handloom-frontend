import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiLayers, FiUsers, FiShoppingBag, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <FiGrid />, path: '/admin' },
        { name: 'Products', icon: <FiBox />, path: '/admin/products' },
        { name: 'Categories', icon: <FiLayers />, path: '/admin/categories' },
        { name: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
        { name: 'Users', icon: <FiUsers />, path: '/admin/users' },
    ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="flex h-screen bg-royal-blue text-off-white font-lato overflow-hidden relative selection:bg-royal-gold selection:text-royal-blue">
            {/* Background Decorations */}
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-royal-gold/5 rounded-full blur-[150px] pointer-events-none" />
             <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-royal-gold/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-royal-blue/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center z-40 h-16">
                <span className="text-lg font-playfair text-royal-gold font-bold">Admin Panel</span>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="text-royal-gold p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-royal-blue/90 backdrop-blur-xl border-r border-white/10 flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-playfair text-royal-gold font-bold">Admin Panel</h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Nirmal Handloom</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-8">
                    <ul className="space-y-2 px-6">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-300 group ${
                                            isActive 
                                            ? 'bg-royal-gold text-royal-blue font-bold shadow-lg shadow-royal-gold/20' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-6'
                                        }`}
                                    >
                                        <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                                        <span className="tracking-wide">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-6 border-t border-white/10 bg-white/5">
                    <div className="flex items-center gap-4 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal-gold to-yellow-600 text-royal-blue flex items-center justify-center font-bold text-lg shadow-lg">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-3 w-full rounded-lg transition-all duration-300 group"
                    >
                        <FiLogOut className="group-hover:-translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                     <Link
                        to="/"
                        className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 w-full rounded-lg transition-all duration-300 mt-2 group"
                    >
                        <FiHome className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Store</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden pt-16 lg:pt-0 w-full relative z-10">
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
