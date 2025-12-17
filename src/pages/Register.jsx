import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    
    const { register, error, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const redirect = location.search ? location.search.split('=')[1] : '/';
            navigate(redirect);
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        setMessage(null);
        await register(name, email, password);
    };

    return (
        <div className="min-h-screen bg-royal-blue pt-24 px-6 flex justify-center items-center">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 p-8 rounded-sm w-full max-w-md backdrop-blur-sm"
            >
                <h2 className="text-3xl font-playfair text-off-white mb-8 text-center">Register</h2>
                {message && <div className="bg-red-500/20 text-red-200 p-3 mb-4 rounded-sm text-sm border border-red-500/30">{message}</div>}
                {error && <div className="bg-red-500/20 text-red-200 p-3 mb-4 rounded-sm text-sm border border-red-500/30">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-royal-gold text-sm uppercase tracking-wide mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-royal-gold transition-colors"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="block text-royal-gold text-sm uppercase tracking-wide mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-royal-gold transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-royal-gold text-sm uppercase tracking-wide mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-royal-gold transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-royal-gold text-sm uppercase tracking-wide mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-sm py-3 px-4 text-white focus:outline-none focus:border-royal-gold transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-royal-gold text-royal-blue font-bold py-3 uppercase tracking-wide hover:bg-white transition-colors mt-4"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-royal-gold hover:text-white underline">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
