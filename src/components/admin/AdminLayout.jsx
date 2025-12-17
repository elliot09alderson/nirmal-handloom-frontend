import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiLayers, FiUsers, FiShoppingBag, FiLogOut, FiHome } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);

    const menuItems = [
        { name: 'Dashboard', icon: <FiGrid />, path: '/admin' },
        { name: 'Products', icon: <FiBox />, path: '/admin/products' },
        { name: 'Categories', icon: <FiLayers />, path: '/admin/categories' },
        { name: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
        { name: 'Users', icon: <FiUsers />, path: '/admin/users' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-royal-blue text-off-white font-lato">
            {/* Sidebar */}
            <div className="w-64 bg-white/5 border-r border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-playfair text-royal-gold font-bold">Admin Panel</h2>
                    <p className="text-xs text-gray-400 mt-1">Nirmal Handloom</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-2 px-4">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors ${
                                            isActive 
                                            ? 'bg-royal-gold text-royal-blue font-bold' 
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-royal-gold text-royal-blue flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-400 hover:text-red-300 px-4 py-2 w-full transition-colors"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                     <Link
                        to="/"
                        className="flex items-center space-x-3 text-gray-400 hover:text-white px-4 py-2 w-full transition-colors mt-2"
                    >
                        <FiHome />
                        <span>Back to Store</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-royal-blue">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
