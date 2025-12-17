import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

import PaymentFailure from './pages/PaymentFailure';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Contact from './pages/Contact';
import About from './pages/About';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <AuthProvider>
            <ShopProvider>
                <Router>
                    <div className="bg-royal-blue min-h-screen text-off-white selection:bg-royal-gold selection:text-royal-blue font-lato flex flex-col">
                        <Navbar />
                        <main className="flex-grow pt-20">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/wishlist" element={<Wishlist />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/payment-success" element={<PaymentSuccess />} />
                                <Route path="/payment-failure" element={<PaymentFailure />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="/terms-of-use" element={<Terms />} />
                                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                                <Route path="/refund-policy" element={<RefundPolicy />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </ShopProvider>
        </AuthProvider>
    );
}

export default App;


