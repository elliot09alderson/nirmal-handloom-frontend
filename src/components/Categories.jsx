import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { categories as fallbackCategories } from '../data';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories(fallbackCategories);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName) => {
        navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
    };

    if (categories.length === 0) return null;

    return (
        <section id="collections" className="py-20 px-6 bg-royal-blue relative">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-royal-gold font-lato uppercase tracking-widest mb-2">Our Collections</h3>
                    <h2 className="text-4xl md:text-5xl font-playfair text-off-white">Handpicked for You</h2>
                    <div className="w-24 h-1 bg-royal-gold mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-96 overflow-hidden rounded-sm cursor-pointer"
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {/* Image */}
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-playfair text-off-white mb-2">{category.name}</h3>
                                <p className="text-gray-300 text-sm font-lato opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {category.description}
                                </p>
                                <div className="w-12 h-0.5 bg-royal-gold mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
