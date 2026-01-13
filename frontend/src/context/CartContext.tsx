import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartItems: cartApi.CartItem[];
    loading: boolean;
    addToCart: (productID: number, quantity?: number) => Promise<void>;
    removeFromCart: (productID: number) => Promise<void>;
    updateQuantity: (productID: number, quantity: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<cartApi.CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    const refreshCart = async () => {
        try {
            const items = await cartApi.fetchCart();
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCartItems([]); // Clear cart on error
        }
    };

    // Refresh cart when user changes (login/logout)
    useEffect(() => {
        refreshCart();
    }, [user]);

    // Listen for logout event to immediately clear cart
    useEffect(() => {
        const handleLogout = async () => {
            console.log('Logout event received, clearing cart'); // Debug log
            setCartItems([]); // Immediately clear cart state

            // Small delay to ensure cookies are cleared on backend
            await new Promise(resolve => setTimeout(resolve, 100));
            // Then fetch fresh guest cart
            await refreshCart();
        };

        window.addEventListener('user-logged-out', handleLogout);
        return () => window.removeEventListener('user-logged-out', handleLogout);
    }, []);

    const addToCart = async (productID: number, quantity: number = 1) => {
        setLoading(true);
        try {
            await cartApi.addToCart(productID, quantity);
            await refreshCart();
        } catch (error) {
            console.error("Failed to add to cart", error);
            throw error; // Re-throw so UI can handle it
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productID: number) => {
        setLoading(true);
        try {
            await cartApi.removeFromCart(productID);
            await refreshCart();
        } catch (error) {
            console.error("Failed to remove from cart", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productID: number, quantity: number) => {
        setLoading(true);
        try {
            await cartApi.updateCartItem(productID, quantity);
            await refreshCart();
        } catch (error) {
            console.error("Failed to update quantity", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, updateQuantity, refreshCart }} >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}