import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchCart = async () => {
        const token = getToken();

        if (!token) {
            setCart(null);
            return;
        }

        try {
            setLoading(true);

            const response = await api.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCart(response.data.cart);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (medicineId, quantity) => {
        const token = getToken();

        const response = await api.post(
            "/cart",
            {
                medicineId,
                quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setCart(response.data.cart);

        return response.data;
    };

    const updateQuantity = async (medicineId, quantity) => {
        const token = getToken();

        const response = await api.put(
            `/cart/${medicineId}`,
            {
                quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setCart(response.data.cart);

        return response.data;
    };

    const removeFromCart = async (medicineId) => {
        const token = getToken();

        const response = await api.delete(
            `/cart/${medicineId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setCart(response.data.cart);

        return response.data;
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};