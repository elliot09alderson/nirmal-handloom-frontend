import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-6 py-24 text-off-white">
            <h1 className="text-4xl md:text-5xl font-playfair text-center mb-16 text-royal-gold">About Nirmal Handloom</h1>

            <div className="max-w-4xl mx-auto space-y-12 font-lato leading-relaxed text-lg text-gray-300">
                <section>
                    <h2 className="text-3xl font-playfair text-white mb-6">Our Heritage</h2>
                    <p>
                        Established in the heart of Varanasi, Nirmal Handloom is more than just a brand; it is a legacy of weaving traditions passed down through generations. Our journey began with a simple passion: to preserve the dying art of handloom weaving and to bring the exquisite craftsmanship of Banarasi sarees to the world.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-playfair text-white mb-6">The Art of Weaving</h2>
                    <p>
                        Every saree at Nirmal Handloom is a masterpiece, painstakingly crafted by skilled artisans who have dedicated their lives to the loom. We believe in authenticity and quality. From the purity of the silk to the intricacies of the zari work, every detail is a testament to the skill and patience of our weavers.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-playfair text-white mb-6">Our Mission</h2>
                    <p>
                        Our mission is to sustain and promote the handloom industry of India properly. We aim to provide a platform for artisans to showcase their talent while offering our customers a genuine, luxurious product that they can cherish forever. We are committed to fair trade practices and ensuring that the true artists—the weavers—get their due recognition and reward.
                    </p>
                </section>

                <div className="border-t border-white/10 pt-12 text-center">
                    <p className="italic text-xl font-playfair text-royal-gold">
                        "Weaving dreams into six yards of elegance."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
