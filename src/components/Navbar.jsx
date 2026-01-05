import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cart, wishlist } = useContext(ShopContext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // ... (rest of handleSearchSubmit and useEffect)

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Collections', href: '/#collections' },
        { name: 'New Arrivals', href: '/#new-arrivals' },
    ];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-effect py-4' : 'bg-royal-blue/95 backdrop-blur-md border-b border-white/10 py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="relative group">
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative px-8 py-2 md:px-10 md:py-3"
                    >
                        {/* Glass background with gradient opacity */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent backdrop-blur-sm rounded-sm"></div>

                        {/* Top border with gradient */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-70"></div>

                        {/* Bottom border with gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-70"></div>

                        <h2 className="relative z-10 text-royal-gold text-xs md:text-sm font-lato tracking-[0.3em] uppercase font-light whitespace-nowrap">
                            Nirmal Saree
                        </h2>
                    </motion.div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link) => {
                         const isActive = link.href === '/' ? location.pathname === '/' : location.pathname.startsWith(link.href);
                         return (
                        <React.Fragment key={link.name}>
                            {link.href.includes('#') ? (
                                <a
                                    href={link.href}
                                    className={`text-off-white hover:text-royal-gold transition-colors duration-300 font-lato tracking-wide text-sm uppercase cursor-pointer px-4 py-2 ${isActive ? 'text-royal-gold font-bold' : ''}`}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    to={link.href}
                                    className={`${isActive ? 'text-royal-gold font-bold' : 'text-off-white'} hover:text-royal-gold transition-colors duration-300 font-lato tracking-wide text-sm uppercase cursor-pointer px-4 py-2`}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </React.Fragment>
                    )})}
                    
                    {/* Admin Link if user is admin */}
                    {user && user.isAdmin && (
                         <Link
                            to="/admin"
                            className={`text-off-white hover:text-royal-gold transition-colors duration-300 font-lato tracking-wide text-sm uppercase cursor-pointer px-4 py-2 ${location.pathname === '/admin' ? 'text-royal-gold font-bold' : ''}`}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Icons */}
                <div className="hidden md:flex items-center space-x-6">
                     {/* Animated Search Bar */}
                     <div 
                        className="relative flex items-center"
                        onMouseEnter={() => setIsSearchOpen(true)}
                        onMouseLeave={() => !searchQuery && setIsSearchOpen(false)}
                     >
                        <motion.div
                            initial={{ width: 40 }}
                            animate={{ width: isSearchOpen || searchQuery ? 200 : 40 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={`flex items-center overflow-hidden rounded-full border ${
                                isSearchOpen || searchQuery ? 'border-royal-gold bg-white/10' : 'border-transparent'
                            }`}
                        >
                            <button 
                                className="p-2 text-off-white hover:text-royal-gold transition-colors z-10"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <FiSearch size={20} />
                            </button>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                placeholder="Search..."
                                className={`bg-transparent text-sm text-off-white placeholder-gray-400 focus:outline-none w-full pr-4 ${
                                    isSearchOpen || searchQuery ? 'opacity-100' : 'opacity-0'
                                } transition-opacity duration-200`}
                            />
                        </motion.div>
                    </div>
                    <Link to="/wishlist" className="text-off-white hover:text-royal-gold transition-colors relative">
                        <FiHeart size={20} />
                        {wishlist.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-deep-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>
                    <Link to="/checkout" className="text-off-white hover:text-royal-gold transition-colors relative">
                        <FiShoppingBag size={20} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-deep-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                    
                    {/* User Auth Sections */}
                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center text-off-white hover:text-royal-gold focus:outline-none">
                                <FiUser size={20} />
                                <span className="ml-2 text-sm max-w-[100px] truncate">{user.name}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-royal-blue border border-white/10 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="block px-4 py-2 text-sm text-off-white hover:bg-white/10">Admin Dashboard</Link>
                                )}
                                <Link to="/profile" className="block px-4 py-2 text-sm text-off-white hover:bg-white/10">Profile</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-off-white hover:bg-white/10">Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="text-off-white hover:text-royal-gold transition-colors text-sm uppercase tracking-wide font-bold">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-off-white hover:text-royal-gold"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
             <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-royal-blue/95 backdrop-blur-lg overflow-hidden"
                    >
                        <div className="flex flex-col items-center py-8 space-y-6">
                            {navLinks.map((link) => (
                                <React.Fragment key={link.name}>
                                    {link.href.includes('#') ? (
                                        <a
                                            href={link.href}
                                            className="text-off-white hover:text-royal-gold text-lg font-playfair py-2 px-4"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-off-white hover:text-royal-gold text-lg font-playfair py-2 px-4"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </React.Fragment>
                            ))}
                            {user && user.isAdmin && (
                                <Link to="/admin" className="text-off-white hover:text-royal-gold text-lg font-playfair py-2 px-4" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                            )}
                            
                            {user ? (
                                <div className="flex flex-col items-center space-y-4 pt-4 border-t border-white/10 w-full">
                                    <span className="text-royal-gold text-sm uppercase tracking-widest">{user.name}</span>
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-off-white hover:text-royal-gold">Logout</button>
                                </div>
                            ) : (
                                <Link to="/login" className="text-off-white hover:text-royal-gold text-lg font-playfair py-2 px-4" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                            )}

                            <div className="flex space-x-6 mt-4">
                                <FiSearch size={24} className="text-off-white" />
                                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FiHeart size={24} className="text-off-white" />
                                </Link>
                                <Link to="/checkout" onClick={() => setIsMobileMenuOpen(false)}>
                                    <FiShoppingBag size={24} className="text-off-white" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;

