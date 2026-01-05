import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import ManageAddresses from '../components/profile/ManageAddresses';
import MyOrders from '../components/profile/MyOrders';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    if (loading) return <div className="h-screen flex justify-center items-center bg-royal-blue text-royal-gold">Loading...</div>;

    return (
        <div className="min-h-screen bg-royal-blue text-off-white font-lato pt-20 pb-12 px-4 md:px-8 relative selection:bg-royal-gold selection:text-royal-blue">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-royal-gold/5 rounded-full blur-[120px]" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-royal-gold/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                         <ProfileSidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            onLogout={handleLogout} 
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'profile' && <ProfileInfo />}
                                {activeTab === 'address' && <ManageAddresses />}
                                {activeTab === 'orders' && <MyOrders />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
