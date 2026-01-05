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
        <div className="min-h-screen bg-royal-blue flex justify-center items-center px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-royal-gold/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-royal-gold/5 rounded-full blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 p-10 rounded-2xl w-full max-w-md backdrop-blur-md shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-playfair text-off-white mb-2">Create Account</h2>
                    <p className="text-gray-400 font-lato text-sm">Join the Nirmal Handloom family</p>
                </div>

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-lg text-sm border border-red-500/20 text-center font-lato"
                    >
                        {message}
                    </motion.div>
                )}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-lg text-sm border border-red-500/20 text-center font-lato"
                    >
                        {error}
                    </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="group">
                        <label className="block text-royal-gold text-xs uppercase tracking-[0.2em] mb-2 font-bold font-lato">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white font-lato placeholder:text-gray-600 focus:outline-none focus:border-royal-gold focus:bg-white/10 transition-all duration-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="group">
                        <label className="block text-royal-gold text-xs uppercase tracking-[0.2em] mb-2 font-bold font-lato">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white font-lato placeholder:text-gray-600 focus:outline-none focus:border-royal-gold focus:bg-white/10 transition-all duration-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="group">
                        <label className="block text-royal-gold text-xs uppercase tracking-[0.2em] mb-2 font-bold font-lato">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white font-lato placeholder:text-gray-600 focus:outline-none focus:border-royal-gold focus:bg-white/10 transition-all duration-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="group">
                        <label className="block text-royal-gold text-xs uppercase tracking-[0.2em] mb-2 font-bold font-lato">Confirm Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-white font-lato placeholder:text-gray-600 focus:outline-none focus:border-royal-gold focus:bg-white/10 transition-all duration-300"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-royal-gold hover:bg-white text-royal-blue font-bold py-4 rounded-xl uppercase tracking-widest transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-royal-gold/10 mt-4 font-lato"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-8 text-center font-lato text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link to="/login" className="text-royal-gold hover:text-white transition-colors underline underline-offset-4">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
