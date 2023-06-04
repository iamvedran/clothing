import { useReducer } from 'react';
import { createContext, useState, useEffect } from 'react';
import { createAction } from '../utils/firebase/reducer/reducer.utils';

export const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id == productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {

  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id == cartItemToRemove.id
  );

  if (existingCartItem.quantity == 1) {
    return cartItems.filter(cartItem => cartItem.id != cartItemToRemove.id);
  }


  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );

}

const clearCartItem = (cartItems, cartItemToRemove) => {
  return cartItems.filter(cartItem => cartItem.id != cartItemToRemove.id);
}

export const CartContext = createContext({
  isCartOpen: false,
  setIsOpen: () => { },
  cartItems: [],
  addItemToCart: () => { },
  removeItemFromCart: () => { },
  clearItemFromCart: () => { },
  cartCount: 0,
  cartTotal: 0
});

const CART_ACTION_TYPES = {
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  SET_IS_CART_OPEN: 'SET_IS_CART_OPEN'
}

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0
}

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return { ...state, ...payload };

    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return { ...state, isCartOpen:payload };

    default:
      throw new Error('unhadled reducer' + type);
  }
}

export const CartProvider = ({ children }) => {
  const [{ isCartOpen, cartItems, cartCount, cartTotal }, dispatch] = useReducer(cartReducer, INITIAL_STATE)

  const updateCartItemsReducer = (newCartItems) => {
    const newCartCount = newCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    const newCartTotal = newCartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);

    dispatch(createAction(CART_ACTION_TYPES.SET_CART_ITEMS, { 
                                                    cartItems: newCartItems, 
                                                    cartTotal: newCartTotal, 
                                                    cartCount: newCartCount }));


  }

  const addItemToCart = (product) => {
    const newCartItems = addCartItem(cartItems, product);
    updateCartItemsReducer(newCartItems);
  }

  const removeItemFromCart = (product) => {
    const newCartItems = removeCartItem(cartItems, product);
    updateCartItemsReducer(newCartItems);
  }

  const clearItemFromCart = (product) => {
    const newCartItems = clearCartItem(cartItems, product);
    updateCartItemsReducer(newCartItems);
  }

  const setIsCartOpen = (bool) => {
    dispatch( createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN,  bool));
  }

  const value = {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    cartCount,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};