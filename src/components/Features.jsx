import React from 'react';
import { motion } from 'framer-motion';
import { TbCertificate, TbShieldCheck, TbCreditCard, TbHeart } from 'react-icons/tb';

const Features = () => {
    const features = [
        {
            id: 1,
            icon: TbCertificate,
            title: 'Made in India',
            description: 'Authentic handloom'
        },
        {
            id: 2,
            icon: TbShieldCheck,
            title: 'Assured Quality',
            description: 'Premium fabrics'
        },
        {
            id: 3,
            icon: TbCreditCard,
            title: 'Secure Payment',
            description: '100% safe checkout'
        },
        {
            id: 4,
            icon: TbHeart,
            title: 'Empowering Weavers',
            description: 'Supporting artisans'
        }
    ];

    return (
        <section className="relative -mt-20 z-20 px-6">
            <div className="container mx-auto">
                <div className="glass-effect rounded-lg p-8 md:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="flex flex-col items-center text-center group cursor-pointer"
                                >
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-16 h-16 rounded-full bg-royal-gold/10 flex items-center justify-center mb-4 group-hover:bg-royal-gold/20 transition-colors"
                                    >
                                        <Icon className="text-royal-gold text-3xl" />
                                    </motion.div>
                                    <h3 className="text-lg font-playfair text-off-white mb-2 group-hover:text-royal-gold transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-lato">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
