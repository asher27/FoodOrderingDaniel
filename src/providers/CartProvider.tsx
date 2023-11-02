import { useInsertOrderItems } from '@/api/order-items';
import { useInsertOrder } from '@/api/orders';
import { CartItem, Tables } from '@/types';
import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { useAuth } from './AuthProvider';
import { initialisePaymentSheet, openPaymentSheet } from '@/lib/stripe';

type CartType = {
    items: CartItem[];
    addItem: (product: Tables<'products'>, size: CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
    checkout: () => void;
};

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
    total: 0,
    checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const router = useRouter();
    const { session } = useAuth();
    const userId = session?.user.id;

    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();

    const addItem = (product: Tables<'products'>, size: CartItem['size']) => {
        const existingItem = items.find(
            (item) => item.product === product && item.size === size
        );

        if (existingItem) {
            updateQuantity(existingItem.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        };

        setItems([newCartItem, ...items]);
    };

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        setItems(
            items
                .map((item) =>
                    item.id !== itemId
                        ? item
                        : { ...item, quantity: item.quantity + amount }
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const total = items.reduce(
        (sum, item) => (sum += item.product.price * item.quantity),
        0
    );

    const clearCart = () => {
        setItems([]);
    };

    const checkout = async () => {
        if (!userId) return;
        if (!items.length) return;

        await initialisePaymentSheet(Math.floor(total * 100));
        const payed = await openPaymentSheet();
        if (!payed) return;

        await insertOrder(
            { total, user_id: userId },
            {
                onSuccess: saveOrderItems,
            }
        );
    };

    const saveOrderItems = (order: Tables<'orders'>) => {

        // console.log('saveOrderItems');
        
        const orderItems = items.map((cartItem) => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size,
        }));
        // console.log('saveOrderItems > orderItems', orderItems);

        insertOrderItems(orderItems, {
            onSuccess() {
                clearCart();
                router.push(`/(user)/orders/${order.id}`);
            },
        });
    };

    return (
        <CartContext.Provider
            value={{ items, addItem, updateQuantity, total, checkout }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
