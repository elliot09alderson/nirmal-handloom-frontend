import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag, FiHeart } from 'react-icons/fi';

const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-royal-blue border border-white/10 rounded-sm max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-royal-gold transition-colors"
                    >
                        <FiX size={24} />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                        <span className="text-royal-gold uppercase tracking-widest text-sm mb-2">
                            {product.category}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-playfair text-off-white mb-4">
                            {product.name}
                        </h2>

                        <div className="flex items-center space-x-4 mb-6">
                            <span className="text-2xl font-bold text-off-white">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-lg text-gray-400 line-through">
                                    ₹{Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-300 font-lato mb-8 leading-relaxed">
                            Experience the luxury of authentic Indian craftsmanship. This {product.name} is woven with precision and care, making it a perfect addition to your wardrobe for special occasions.
                        </p>

                        <div className="flex space-x-4">
                            <button className="flex-1 bg-royal-gold text-royal-blue font-bold py-3 px-6 rounded-sm hover:bg-white transition-colors flex items-center justify-center space-x-2">
                                <FiShoppingBag />
                                <span>Add to Cart</span>
                            </button>
                            <button className="p-3 border border-white/20 text-off-white rounded-sm hover:border-royal-gold hover:text-royal-gold transition-colors">
                                <FiHeart size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductModal;
