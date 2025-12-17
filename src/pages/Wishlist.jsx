import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
    const { wishlist } = useContext(ShopContext);
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 py-24 min-h-[60vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-playfair text-off-white mb-4">My Wishlist</h1>
                <div className="w-24 h-1 bg-royal-gold mx-auto"></div>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                    <FiHeart size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xl mb-6">Your wishlist is empty.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-royal-gold text-royal-blue font-bold py-3 px-8 rounded-sm hover:bg-white transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onOpen={() => navigate(`/product/${product.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
