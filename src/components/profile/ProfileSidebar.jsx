import React, { useContext } from 'react';
import { FiUser, FiMapPin, FiPackage, FiLogOut, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProfileSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const { user } = useContext(AuthContext);

    const menuItems = [
        { id: 'profile', label: 'Edit Profile', icon: <FiUser /> },
        { id: 'address', label: 'Manage Addresses', icon: <FiMapPin /> },
        { id: 'orders', label: 'My Orders', icon: <FiPackage /> },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-playfair text-royal-gold font-bold">My Account</h3>
                <p className="text-sm text-gray-400 mt-1">Manage your profile</p>
            </div>
            <div className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    activeTab === item.id 
                                    ? 'bg-royal-gold text-royal-blue font-bold shadow-lg shadow-royal-gold/20' 
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                    
                    {user && user.role === 'admin' && (
                        <li>
                             <Link
                                to="/admin"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
                            >
                                <span className="text-lg"><FiGrid /></span>
                                <span>Admin Dashboard</span>
                            </Link>
                        </li>
                    )}

                    <li>
                         <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 mt-4"
                        >
                            <span className="text-lg"><FiLogOut /></span>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileSidebar;
