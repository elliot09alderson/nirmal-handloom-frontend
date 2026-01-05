import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { FiSave, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProfileInfo = () => {
    const { user, login } = useContext(AuthContext); // Re-login to update context with new user data
    
    // We need local state because we are editing
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsUpdating(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await api.put(
                '/users/profile',
                { name, email, phone, password },
                config
            );
            
            // Update context
            // Assuming context has a way to update user, or we can just call login with new data/token 
            // But usually we just update the user object in storage/state found in AuthContext.
            // Since our AuthContext 'login' function accepts (email, password), it might call API again.
            // Best way: reload window or if AuthContext provides 'setUser'.
            // For now, let's update data in local storage manually or if AuthContext automatically reads it.
            localStorage.setItem('userInfo', JSON.stringify(data));
            // Trigger a reload or better, if we had a proper set user action.
            // A hacky way for now is just reload or hope user login persists?
            // Wait, AuthContext usually reads from localStorage on init.
            
            setMessage('Profile Updated Successfully');
            setIsUpdating(false);
            window.location.reload(); // Simple way to refresh context
        } catch (error) {
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            setIsUpdating(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
        >
            <h2 className="text-2xl font-playfair text-off-white mb-6">Edit Profile</h2>
            
            {message && <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4 border border-green-500/30">{message}</div>}
            {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 border border-red-500/30">{error}</div>}

            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Full Name</label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-3.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-royal-gold transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Email Address</label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3.5 text-gray-500" />
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-royal-gold transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Phone Number</label>
                    <div className="relative">
                        <FiPhone className="absolute left-3 top-3.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-royal-gold transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <p className="text-sm text-gray-400 mb-4">Leave duplicate blank if you don't want to change password</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">New Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-royal-gold transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Confirm Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-royal-gold transition-colors"
                                />
                            </div>
                        </div>
                   </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-royal-gold text-royal-blue px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-lg hover:shadow-royal-gold/20 disabled:opacity-50"
                    >
                        {isUpdating ? 'Updating...' : <><FiSave /> Save Changes</>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ProfileInfo;
