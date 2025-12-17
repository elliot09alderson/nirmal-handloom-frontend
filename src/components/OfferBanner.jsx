import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OfferBanner = () => {
    return (
        <section className="py-16 px-6 container mx-auto mb-10">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[#1a2035] to-[#0a0f1c] border border-royal-gold/20 shadow-2xl"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-royal-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal-blue/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
                
                {/* Golden Border Frame */}
                <div className="absolute inset-2 border border-royal-gold/10 rounded-sm"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-8">
                    <div className="text-center md:text-left max-w-2xl">
                        <span className="inline-block py-1 px-3 border border-royal-gold/30 rounded-full text-royal-gold text-xs tracking-[0.2em] uppercase mb-4 font-lato">
                            Limited Time Offer
                        </span>
                        <h2 className="text-3xl md:text-5xl font-playfair text-off-white mb-4 leading-tight">
                            Experience the Luxury of <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-[#fff6e0]">Authentic Banarasi</span>
                        </h2>
                        <p className="text-gray-400 font-lato tracking-wide text-sm md:text-base mb-0">
                            Get Flat <span className="text-white font-bold text-lg">20% OFF</span> on your first order. Use Code: <span className="text-royal-gold font-bold font-mono">ROYAL20</span>
                        </p>
                    </div>

                    <div className="relative">
                        <Link 
                            to="/shop" 
                            className="inline-flex items-center justify-center px-10 py-4 bg-royal-gold text-royal-blue font-lato font-bold uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            Shop the Collection
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default OfferBanner;
