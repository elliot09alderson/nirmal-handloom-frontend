import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import Profile from './pages/Profile';

// Internal Layout component to handle conditional conditional rendering
const AppLayout = ({ children }) => {
    const location = useLocation();
    // Check if current path starts with /admin (but allow /admin/login if that uses standard layout - actually user wants admin panel separate, so all /admin except maybe login? No, login page is standalone usually, but here it's fine to keep navbar if it's just login form. 
    // However, the requested screenshot issue was ON /admin dashboard.
    // Let's hide navbar for all /admin routes including login if acceptable, or just exclude /admin/login from the check if needed.
    // Actually, Admin Login usually is cleaner without the main shop navbar. I'll hide it for all /admin.
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="bg-royal-blue min-h-screen text-off-white selection:bg-royal-gold selection:text-royal-blue font-lato flex flex-col">
            {!isAdminRoute && <Navbar />}
            <main className={`flex-grow ${!isAdminRoute ? 'pt-20' : ''}`}>
                {children}
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <ShopProvider>
                <Router>
                   <AppLayout>
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
                            <Route path="/admin/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route path="/admin/categories" element={<AdminCategories />} />
                            <Route path="/admin/orders" element={<AdminOrders />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                        </Routes>
                   </AppLayout>
                </Router>
            </ShopProvider>
        </AuthProvider>
    );
}

export default App;


