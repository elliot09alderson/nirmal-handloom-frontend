import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const ProductCard = ({ product, onOpen }) => {
    const { addToCart, addToWishlist, isInWishlist, cart } = useContext(ShopContext);
    const navigate = useNavigate();

    // Helper to find quantity safely handling _id vs id
    const cartItem = cart.find(item => 
        (item._id && item._id === product._id) || (item.id && item.id === product.id)
    );
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleNavigate = () => {
        // If onOpen is passed (e.g. for modal), use it, otherwise navigate
        navigate(`/product/${product._id || product.id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };
    
    const handleWishlist = (e) => {
        e.stopPropagation();
        addToWishlist(product);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative cursor-pointer p-3 bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            onClick={handleNavigate}
        >
            {/* Golden Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-royal-gold opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-royal-gold opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-royal-gold opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-royal-gold opacity-50 group-hover:opacity-100 transition-opacity"></div>

            {/* Image Container */}
            <div className="relative h-[22rem] overflow-hidden mb-4">
                <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-deep-red text-white text-xs font-bold px-2 py-1 z-10">
                        -{product.discount}%
                    </div>
                )}
                
                {/* Wishlist Button - Absolute Top Right */}
                 <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 ${
                        isInWishlist(product._id || product.id)
                        ? 'bg-deep-red text-white'
                        : 'bg-black/20 text-white backdrop-blur-sm hover:bg-black/40'
                    }`}
                >
                    <FiHeart size={16} className={isInWishlist(product._id || product.id) ? 'fill-current' : ''} />
                </button>

                {/* Quick Add To Cart - Slide Up on Hover */}
                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                     <button
                        onClick={handleAddToCart}
                        className="w-full py-2 bg-white text-royal-blue font-lato uppercase text-xs font-bold tracking-widest hover:bg-royal-gold transition-colors flex items-center justify-center gap-2"
                    >
                        {quantity > 0 ? (
                            <>
                                <FiShoppingBag /> In Cart: {quantity}
                            </>
                        ) : (
                            "Add to Cart"
                        )}
                    </button>
                </div>
            </div>

            {/* Details - Minimal */}
            <div className="text-center pb-2">
                <p className="text-xs text-royal-gold uppercase tracking-wider mb-1">
                    {product.category?.name || product.category || 'Collection'}
                </p>
                <h3 className="text-base font-playfair text-off-white mb-2 group-hover:text-royal-gold transition-colors">
                    {product.name}
                </h3>
                <div className="flex justify-center items-center space-x-3">
                    <span className="text-sm font-bold text-off-white">₹{product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through">
                            ₹{Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
