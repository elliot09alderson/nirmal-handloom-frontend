import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FiHeart, FiShoppingBag, FiStar, FiArrowLeft, FiShare2, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { products as mockProducts } from '../data';
import SEO from '../components/SEO';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, addToWishlist, isInWishlist, cart, updateQuantity, removeFromCart } = useContext(ShopContext);
    const [product, setProduct] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data.product);
                setRecommended(data.similarProducts);
                setActiveImage(data.product.image); // Default to main image
                setLoading(false);
            } catch (err) {
                console.warn("Backend failed, using mock data:", err);
                const foundProduct = mockProducts.find(p => p.id == id || p._id === id); // loose equality for id match
                if (foundProduct) {
                    setProduct(foundProduct);
                    const similar = mockProducts.filter(p => p.id !== foundProduct.id).slice(0, 4);
                    setRecommended(similar);
                    setActiveImage(foundProduct.image);
                    setLoading(false);
                } else {
                    setError("Product not found");
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="text-center py-20 text-off-white">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (!product) return <div className="text-center py-20 text-off-white">Product not found</div>;

    const discountedPrice = Math.round(product.price * (1 + product.discount / 100));

    // Combine main image and additional images for carousel
    const allImages = [product.image, ...(product.images || [])];

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} on Nirmal Handloom!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Helper to find item in cart
    const cartItem = product && cart.find(item => item.id === (product._id || product.id));

    return (
        <div className="container mx-auto px-6 py-24">
             <SEO 
                title={product.name} 
                description={product.description}
                image={activeImage}
            />
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-royal-gold mb-8 hover:text-white transition-colors"
            >
                <FiArrowLeft className="mr-2" /> Back to Shop
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                >
                    {/* Main Image */}
                    <div className="relative h-[400px] lg:h-[500px] rounded-sm overflow-hidden border border-white/10">
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.discount > 0 && (
                            <div className="absolute top-6 left-6 bg-deep-red text-white text-sm font-bold px-4 py-2 rounded-sm">
                                -{product.discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-royal-gold' : 'border-transparent hover:border-white/30'
                                        }`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col justify-center"
                >
                    <h3 className="text-royal-gold text-sm uppercase tracking-widest mb-2">
                        {product.category?.name || product.category || 'Collection'}
                    </h3>
                    <h1 className="text-4xl md:text-5xl font-playfair text-off-white mb-4">
                        {product.name}
                    </h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex text-royal-gold">
                            {[...Array(5)].map((_, i) => (
                                <FiStar
                                    key={i}
                                    className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                                />
                            ))}
                        </div>
                        <span className="text-gray-400 text-sm">({product.numReviews} Reviews)</span>
                    </div>

                    <div className="flex items-end space-x-4 mb-8">
                        <span className="text-3xl font-bold text-off-white">
                            ₹{product.price.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-xl text-gray-500 line-through mb-1">
                                ₹{discountedPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="flex space-x-4 mb-8">
                        {cartItem ? (
                            <div className="flex-1 flex items-center justify-between bg-green-600/90 text-white rounded-sm px-6 py-4 font-bold border border-green-600">
                                <button
                                    onClick={() => cartItem.quantity > 1 ? updateQuantity(cartItem.id, -1) : removeFromCart(cartItem.id)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <FiMinus size={18} />
                                </button>
                                <span className="mx-4">{cartItem.quantity} Added</span>
                                <button
                                    onClick={() => updateQuantity(cartItem.id, 1)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <FiPlus size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(product)}
                                className="flex-1 font-bold py-4 px-6 rounded-sm transition-colors flex items-center justify-center space-x-2 bg-royal-gold text-royal-blue hover:bg-white"
                            >
                                <FiShoppingBag size={20} />
                                <span>Add to Cart</span>
                            </button>
                        )}
                        <button
                            onClick={() => addToWishlist(product)}
                            className={`p-4 border border-white/20 rounded-sm transition-colors flex items-center justify-center ${isInWishlist(product._id || product.id)
                                ? 'bg-deep-red text-white border-deep-red'
                                : 'text-off-white hover:bg-white/10'
                                }`}
                        >
                            <FiHeart size={24} className={isInWishlist(product._id || product.id) ? 'fill-current' : ''} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-4 border border-white/20 rounded-sm text-off-white hover:bg-white/10 transition-colors flex items-center justify-center"
                            title="Share"
                        >
                            <FiShare2 size={24} />
                        </button>
                    </div>

                    <div className="border-t border-white/10 pt-6 space-y-2 text-sm text-gray-400">
                        <p>SKU: NH-{(product._id || product.id).toString().slice(-4).toUpperCase()}</p>
                        <p>Category: {product.category?.name || product.category}</p>
                        <p>Tags: Traditional, Silk, Wedding, Festive</p>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section */}
            <div className="mb-20">
                <h2 className="text-3xl font-playfair text-off-white mb-8">Customer Reviews</h2>
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {product.reviews.map((review) => (
                            <div key={review._id || review.id} className="bg-white/5 p-6 rounded-sm border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-off-white">{review.name}</h4>
                                    <div className="flex text-royal-gold text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={i < review.rating ? "fill-current" : ""} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">No reviews yet.</p>
                )}
            </div>

            {/* Recommended Products */}
            {recommended.length > 0 && (
                <div>
                    <h2 className="text-3xl font-playfair text-off-white mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommended.map((item) => (
                            <ProductCard key={item._id || item.id} product={item} onOpen={() => navigate(`/product/${item._id || item.id}`)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
