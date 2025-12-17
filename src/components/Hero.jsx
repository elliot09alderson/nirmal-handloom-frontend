import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Hero = () => {
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            textRef.current.children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.5 }
        );
    }, []);

    const heroSlides = [
        {
            id: 1,
            image: '/assets/saree_model_1.png',
            title: 'Royal Banarsi Collection',
            subtitle: 'Timeless Elegance'
        },
        {
            id: 2,
            image: '/assets/saree_model_2.png',
            title: 'Silk Saree Heritage',
            subtitle: 'Woven in Tradition'
        },
        {
            id: 3,
            image: '/assets/hero_bg.png',
            title: 'Festive Special',
            subtitle: 'Celebrate in Style'
        }
    ];

    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Swiper Carousel */}
            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-royal-gold',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-royal-gold',
                }}
                loop={true}
                className="w-full h-full"
            >
                {heroSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full  h-full">
                            {/* Background Image */}
                            <div className="absolute inset-0 ">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/80 via-royal-blue/50 to-royal-blue/90" />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">

                <div ref={textRef} className="max-w-5xl">


                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-light text-off-white mb-8 leading-[1.1] tracking-tight">
                        Timeless<br />
                        <span className="italic font-normal text-royal-gold">Elegance</span>
                    </h1>

                    <p className="text-white/80 text-lg md:text-xl font-lato max-w-2xl mx-auto mb-12 font-normal leading-relaxed tracking-wide drop-shadow-sm">
                        Handcrafted sarees woven with tradition and love
                    </p>

                    {/* Rolling Button */}
                    <div className="inline-block group">
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative px-10 py-4 bg-royal-gold text-royal-blue font-semibold font-lato uppercase tracking-widest text-sm rounded-sm overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
                            >
                                <span className="relative z-10 inline-block group-hover:animate-roll-up">
                                    Explore Collection
                                </span>
                                <span className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Bottom Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-royal-blue to-transparent z-10" />
        </section>
    );
};

export default Hero;
