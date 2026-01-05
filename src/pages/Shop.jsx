import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiSearch, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';
import { products as mockProducts } from '../data';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState(50000);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high'
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Expanded states for accordion categories
    const [expandedCategories, setExpandedCategories] = useState({
        'Traditional': true,
        'Fabric': true
    });

    const toggleCategory = (cat) => {
        setExpandedCategories(prev => ({
            ...prev,
            [cat]: !prev[cat]
        }));
    };

    // Derived Categories Hierarchy (Simulated for "Sub-categories" feel based on available data)
    const categoryHierarchy = [
        {
            title: 'Collections',
            items: ['Saree', 'Lancha', 'Suit Piece', 'Western Gown']
        },
        {
            title: 'Traditional',
            items: ['Banarsi', 'Patola', 'Kanjivaram', 'Chanderi', 'Cotton Mangalagiri', 'Dharmavaram Silk']
        },
        {
            title: 'Fabric',
            items: ['Silk', 'Cotton']
        }
    ];

    // Sync state with URL params
    useEffect(() => {
        const catParam = searchParams.get('category');
        const keywordParam = searchParams.get('keyword');
        if (catParam) setCategory(catParam);
        if (keywordParam) setKeyword(keywordParam);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Mock Backend Filter Logic
                // in real app: const { data } = await api.get(`/products?keyword=${keyword}&category=${category}...`);
                const { data } = await api.get('/products'); 
                applyFilters(data.products || data || mockProducts);
            } catch (err) {
                console.warn("Backend failed/mocking:", err);
                applyFilters(mockProducts);
            }
        };

        const applyFilters = (data) => {
            let filtered = [...data];

            // Category Filter
            if (category) {
                filtered = filtered.filter(p => {
                    const pCat = p.category.name || p.category;
                    return pCat === category;
                });
            }

            // Keyword Filter
            if (keyword) {
                const lowerKeyword = keyword.toLowerCase();
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(lowerKeyword) ||
                    (p.category.name || p.category).toLowerCase().includes(lowerKeyword)
                );
            }

            // Price Filter
            filtered = filtered.filter(p => p.price <= priceRange);

            // Sorting
            if (sortBy === 'price-low') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-high') {
                filtered.sort((a, b) => b.price - a.price);
            } else {
                // Newest (Mock logic: essentially maintain order or sort by ID)
                filtered.sort((a, b) => b.id - a.id);
            }

            setProducts(filtered);
            setLoading(false);
        };

        fetchProducts();
    }, [keyword, category, priceRange, sortBy]);

    const handleCategorySelect = (cat) => {
        setCategory(cat === category ? '' : cat); // Toggle off if clicked again
        setIsMobileFilterOpen(false);
    };

    const clearFilters = () => {
        setCategory('');
        setKeyword('');
        setPriceRange(50000);
        setSortBy('newest');
        setSearchParams({});
    };

    return (
        <div className="bg-royal-blue min-h-screen pt-10 pb-20">
            {/* Header */}
            <div className="bg-royal-blue border-b border-white/10 pb-8 mb-8">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-white mb-4 drop-shadow-sm  leading-relaxed">Shop Collection</h1>
                    <p className="text-gray-400 font-lato text-sm md:text-base tracking-[0.2em] uppercase font-light">
                        Discover the finest handloom sarees
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-10">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                    <button 
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="flex items-center gap-2 text-royal-gold border border-royal-gold/30 px-4 py-2 rounded-sm"
                    >
                        <FiFilter /> Filters
                    </button>
                    <span className="text-gray-400 text-sm">{products.length} Products</span>
                </div>

                {/* Sidebar Filters */}
                <aside className={`fixed inset-0 z-50 bg-royal-blue lg:static lg:bg-transparent lg:z-auto lg:w-1/4 lg:block transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto`}>
                    <div className="p-6 lg:p-0 border-r border-white/10 lg:border-none min-h-screen lg:min-h-0">
                        <div className="flex justify-between items-center lg:hidden mb-6">
                            <h2 className="text-xl font-playfair text-royal-gold">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="text-off-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Search in Sidebar */}
                        <div className="mb-8 relative">
                            <input 
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search collection..."
                                className="w-full bg-white/5 border border-white/10 text-off-white px-4 py-3 rounded-sm focus:outline-none focus:border-royal-gold transition-colors pl-10"
                            />
                            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h3 className="text-royal-gold font-lato uppercase tracking-widest text-xs mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categoryHierarchy.map((group) => (
                                    <div key={group.title} className="mb-4">
                                        <button 
                                            onClick={() => toggleCategory(group.title)}
                                            className="flex items-center justify-between w-full text-left text-off-white hover:text-royal-gold mb-2 group"
                                        >
                                            <span className="font-playfair text-lg">{group.title}</span>
                                            {expandedCategories[group.title] ? <FiChevronDown /> : <FiChevronRight />}
                                        </button>
                                        <AnimatePresence>
                                            {expandedCategories[group.title] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden ml-2 space-y-2 border-l border-white/10 pl-4"
                                                >
                                                    {group.items.map(item => (
                                                        <div key={item} className="flex items-center">
                                                            <input 
                                                                type="checkbox"
                                                                id={item}
                                                                checked={category === item}
                                                                onChange={() => handleCategorySelect(item)}
                                                                className="accent-royal-gold w-4 h-4 rounded-sm border-gray-600 bg-transparent"
                                                            />
                                                            <label 
                                                                htmlFor={item}
                                                                className={`ml-3 text-sm cursor-pointer transition-colors ${category === item ? 'text-royal-gold font-bold' : 'text-gray-400 hover:text-white'}`}
                                                            >
                                                                {item}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-8">
                            <h3 className="text-royal-gold font-lato uppercase tracking-widest text-xs mb-4">Price Range</h3>
                            <input
                                type="range"
                                min="0"
                                max="50000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-royal-gold"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>₹0</span>
                                <span>Max: ₹{priceRange.toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={clearFilters}
                            className="text-xs text-gray-500 underline hover:text-royal-gold transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-full lg:w-3/4">
                    {/* Top Bar Sort */}
                    <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-sm border border-white/5">
                        <p className="text-gray-400 text-sm hidden md:block">
                            Showing <span className="text-royal-gold font-bold">{products.length}</span> results
                        </p>
                        
                        <div className="flex items-center gap-3 ml-auto md:ml-0">
                            <label className="text-sm text-gray-400">Sort by:</label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-off-white text-sm border-none focus:ring-0 cursor-pointer [&>option]:bg-royal-blue"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <div className="animate-pulse text-royal-gold text-xl font-playfair">Loading Exquisite Collection...</div>
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 border border-white/5 bg-white/5 rounded-sm">
                                    <h3 className="text-2xl font-playfair text-off-white mb-2">No matches found</h3>
                                    <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
                                    <button 
                                        onClick={clearFilters} 
                                        className="px-6 py-2 bg-royal-gold text-royal-blue font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id || product.id}
                                            product={product}
                                            onOpen={setSelectedProduct}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Shop;
