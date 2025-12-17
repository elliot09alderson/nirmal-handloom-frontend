import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Contact = () => {
    return (
        <div className="container mx-auto px-6 py-24 text-off-white">
            <h1 className="text-4xl md:text-5xl font-playfair text-center mb-16 text-royal-gold">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-white/5 p-8 rounded-sm border border-white/10">
                        <h2 className="text-2xl font-playfair mb-6 text-white">Get in Touch</h2>
                        <ul className="space-y-6 font-lato">
                            <li className="flex items-start tracking-wide">
                                <FiMapPin className="text-royal-gold mt-1 mr-4 shrink-0" size={24} />
                                <div>
                                    <strong className="block text-lg text-white mb-1">Visit Us</strong>
                                    <p className="text-gray-400">Shop No 5, Silk Market,</p>
                                    <p className="text-gray-400">Varanasi, Uttar Pradesh 221001,</p>
                                    <p className="text-gray-400">India</p>
                                </div>
                            </li>
                            <li className="flex items-center tracking-wide">
                                <FiPhone className="text-royal-gold mr-4 shrink-0" size={24} />
                                <div>
                                    <strong className="block text-lg text-white mb-1">Call Us</strong>
                                    <p className="text-gray-400">+91 98765 43210</p>
                                </div>
                            </li>
                            <li className="flex items-center tracking-wide">
                                <FiMail className="text-royal-gold mr-4 shrink-0" size={24} />
                                <div>
                                    <strong className="block text-lg text-white mb-1">Email Us</strong>
                                    <p className="text-gray-400">support@nirmalhandloom.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/5 p-8 rounded-sm border border-white/10">
                        <h2 className="text-2xl font-playfair mb-4 text-white">Business Hours</h2>
                        <ul className="space-y-2 text-gray-400 font-lato">
                            <li className="flex justify-between">
                                <span>Monday - Friday:</span>
                                <span>10:00 AM - 8:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Saturday:</span>
                                <span>10:00 AM - 6:00 PM</span>
                            </li>
                            <li className="flex justify-between text-royal-gold">
                                <span>Sunday:</span>
                                <span>Closed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/5 p-8 rounded-sm border border-white/10">
                    <h2 className="text-2xl font-playfair mb-6 text-white">Send us a Message</h2>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400" htmlFor="name">
                                Your Name
                            </label>
                            <input
                                className="w-full bg-transparent border border-white/20 p-3 text-off-white outline-none focus:border-royal-gold rounded-sm transition-colors"
                                id="name"
                                type="text"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full bg-transparent border border-white/20 p-3 text-off-white outline-none focus:border-royal-gold rounded-sm transition-colors"
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                className="w-full bg-transparent border border-white/20 p-3 text-off-white outline-none focus:border-royal-gold rounded-sm transition-colors h-32"
                                id="message"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            className="bg-royal-gold text-royal-blue font-bold py-3 px-8 rounded-sm hover:bg-white transition-colors w-full uppercase tracking-widest"
                            type="button"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
