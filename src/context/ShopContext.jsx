import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Load from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product) => {
        setCart((prev) => {
            const productId = product._id || product.id;
            const existing = prev.find((item) => (item._id || item.id) === productId);
            if (existing) {
                return prev.map((item) =>
                    (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, id: productId, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));
    };

    const updateQuantity = (productId, amount) => {
        setCart((prev) =>
            prev.map((item) =>
                (item._id || item.id) === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            )
        );
    };

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            const productId = product._id || product.id;
            if (prev.find((item) => (item._id || item.id) === productId)) return prev;
            return [...prev, { ...product, id: productId }];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => (item._id || item.id) === productId);
    };

    return (
        <ShopContext.Provider
            value={{
                cart,
                wishlist,
                addToCart,
                removeFromCart,
                updateQuantity,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};
