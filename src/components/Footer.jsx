import React from 'react';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-royal-blue text-off-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20">
                    
                    {/* Brand Section (4 cols) */}
                    <div className="md:col-span-4 space-y-8">
                        <div>
                             <h2 className="text-3xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-white mb-4">
                                Nirmal Handloom
                            </h2>
                            <p className="text-gray-400 font-lato text-sm leading-8 tracking-wide font-light">
                                Weaving traditions into timeless elegance. Our handloom sarees are a tribute to the artisans of India, crafted with passion and heritage in every thread.
                            </p>
                        </div>
                        <div className="flex space-x-6">
                            {[FiInstagram, FiFacebook, FiTwitter].map((Icon, idx) => (
                                <a 
                                    key={idx} 
                                    href="#" 
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-royal-gold hover:border-royal-gold transition-all duration-300 group"
                                >
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links (2 cols) */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h3 className="text-lg font-playfair text-royal-gold mb-8 relative inline-block">
                            Explore
                            <span className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-royal-gold/50"></span>
                        </h3>
                        <ul className="space-y-4 font-lato text-sm tracking-widest uppercase font-light text-gray-400">
                             <li><Link to="/shop" className="hover:text-white transition-colors hover:pl-2 duration-300 block">Shop</Link></li>
                             <li><Link to="/about" className="hover:text-white transition-colors hover:pl-2 duration-300 block">About Us</Link></li>
                             <li><Link to="/#collections" className="hover:text-white transition-colors hover:pl-2 duration-300 block">Collections</Link></li>
                             <li><Link to="/contact" className="hover:text-white transition-colors hover:pl-2 duration-300 block">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Help (3 cols) */}
                    <div className="md:col-span-3">
                         <h3 className="text-lg font-playfair text-royal-gold mb-8 relative inline-block">
                            Assistance
                            <span className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-royal-gold/50"></span>
                        </h3>
                         <ul className="space-y-4 font-lato text-sm tracking-wide font-light text-gray-400">
                             <li className="flex items-start gap-4">
                                <FiMapPin className="text-royal-gold mt-1 shrink-0" />
                                <span className="leading-relaxed">B4 wholesale cloth market,<br/>Pulgaon district durg, CG</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <FiPhone className="text-royal-gold shrink-0" />
                                <span>+91 62613 41129</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <FiMail className="text-royal-gold shrink-0" />
                                <span>dewangammayanku@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (3 cols) */}
                    <div className="md:col-span-3">
                        <h3 className="text-lg font-playfair text-white mb-6">Stay in Vogue</h3>
                        <p className="text-gray-400 text-sm mb-6 font-lato font-light">
                            Subscribe for exclusive launches and stories.
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="w-full bg-transparent border-b border-white/20 py-4 text-off-white placeholder-gray-600 focus:outline-none focus:border-royal-gold transition-colors font-lato text-sm"
                            />
                            <button className="absolute right-0 bottom-4 text-royal-gold hover:text-white transition-colors">
                                <FiArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-gray-500 font-lato tracking-widest uppercase">
                    <p>&copy; 2025 Nirmal Handloom. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-royal-gold transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-use" className="hover:text-royal-gold transition-colors">Terms of Use</Link>
                        <Link to="/shipping-policy" className="hover:text-royal-gold transition-colors">Shipping</Link>
                        <Link to="/refund-policy" className="hover:text-royal-gold transition-colors">Cancellation & Returns</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
