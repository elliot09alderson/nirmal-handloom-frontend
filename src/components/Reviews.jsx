import React from 'react';
import { motion } from 'framer-motion';
import { reviews } from '../data';
import { FiStar } from 'react-icons/fi';

const Reviews = () => {
    // 4 Duplicates for seamless loop on wide screens
    // Loop logic: Move 25% of the total width (which equals 1 set length)
    // Then reset to 0. Since Set 2 is identical to Set 1, the reset is invisible.
    const marqueeReviews = [...reviews, ...reviews, ...reviews, ...reviews];

    return (
        <section className="py-20 bg-royal-blue relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"></div>

            <div className="container mx-auto relative z-10 px-6 mb-20">
                <div className="text-center">
                    <h3 className="text-royal-gold font-lato uppercase tracking-widest mb-2">Testimonials</h3>
                    <h2 className="text-4xl md:text-5xl font-playfair text-off-white">What Our Clients Say</h2>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full z-10 overflow-hidden group">
                {/* Gradient Masks for fading edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-royal-blue via-royal-blue/80 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-royal-blue via-royal-blue/80 to-transparent z-20 pointer-events-none"></div>

                {/* CSS Animation Styles */}
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-25%); }
                    }
                    .animate-scroll {
                        animation: scroll 60s linear infinite;
                    }
                    .group:hover .animate-scroll {
                        animation-play-state: paused;
                    }
                `}</style>

                <div className="w-full overflow-hidden flex">
                    <div className="flex px-4 animate-scroll">
                        {marqueeReviews.map((review, index) => (
                             <div 
                                key={`${review.id}-${index}`}
                                className="w-[350px] shrink-0 bg-white/5 backdrop-blur-md p-8 rounded-sm border border-white/10 hover:border-royal-gold/30 transition-colors mr-12"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <img 
                                        src={review.image} 
                                        alt={review.name} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-royal-gold/50"
                                    />
                                    <div>
                                        <h4 className="text-lg font-playfair text-off-white leading-tight">{review.name}</h4>
                                        <p className="text-xs text-royal-gold/80 font-lato">{review.email}</p>
                                        <p className="text-xs text-gray-500 font-lato mt-0.5">{review.location}</p>
                                    </div>
                                </div>

                                <div className="flex text-royal-gold mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <FiStar key={i} className="fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-300 font-lato italic leading-relaxed">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
