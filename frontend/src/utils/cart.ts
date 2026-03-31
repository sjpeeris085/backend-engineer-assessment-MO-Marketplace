import { message } from 'antd';
import { type Product } from '../schemas/product.schema';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'marketplace_cart';

export const getCart = (): CartItem[] => {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch (error) {
    console.error('Failed to parse cart from local storage', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event to sync cross-component state (like the Header badge)
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Failed to save cart to local storage', error);
  }
};

export const addToCart = (product: Product) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  saveCart(cart);
  message.success(`${product.name} added to cart!`);
};

export const updateQuantity = (productId: string | number, quantity: number) => {
  if (quantity < 1) return;
  const cart = getCart();
  const index = cart.findIndex((item) => item.product.id === productId);
  if (index > -1) {
    cart[index].quantity = quantity;
    saveCart(cart);
  }
};

export const removeFromCart = (productId: string | number) => {
  let cart = getCart();
  cart = cart.filter((item) => item.product.id !== productId);
  saveCart(cart);
  message.success('Item removed from cart.');
};

export const clearCart = () => {
  saveCart([]);
};
