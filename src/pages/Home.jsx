import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';
import Reviews from '../components/Reviews';
import OfferBanner from '../components/OfferBanner';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';
import { products as mockProducts } from '../data';

const Home = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // In a real scenario, you'd pass filters to the backend
                // For now, we'll fetch all products
                const { data } = await api.get('/products');
                
                // Validate that we received expected data structure
                if (data && (Array.isArray(data) || (data.products && Array.isArray(data.products)))) {
                     // Backend now returns object with products array and pagination
                     setProducts(data.products || data);
                } else {
                    console.error("Invalid API response format (expected array):", data);
                    // Force fallback logic to trigger
                    throw new Error("Invalid API response");
                }
                setLoading(false);
            } catch (err) {
                console.warn("Backend fetch failed or invalid response, using mock data.", err);
                // Fallback to mock data
                setProducts(mockProducts);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <Hero />
            <Features />
            <Categories />

            {/* Featured Products Section */}
            <section id="new-arrivals" className="py-20 px-6 container mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-royal-gold font-lato uppercase tracking-widest mb-2">New Arrivals</h3>
                    <h2 className="text-4xl md:text-5xl font-playfair text-off-white">Trending This Season</h2>
                    <div className="w-24 h-1 bg-royal-gold mx-auto mt-6"></div>
                </div>



                {loading ? (
                    <div className="text-center text-royal-gold text-xl">Loading products...</div>
                ) : error ? (
                    <div className="text-center text-red-500">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onOpen={setSelectedProduct}
                            />
                        ))}
                    </div>
                )}
            </section>



            <OfferBanner />
            <Reviews />

            {/* Product Modal - Kept for quick view if needed, or can be removed in favor of details page */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
};

export default Home;
