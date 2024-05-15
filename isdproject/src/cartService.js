import Cookies from 'js-cookie';

export const addToCart = (productId, quantity) => {
  const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
  cart[productId] = quantity;
  Cookies.set('cart', JSON.stringify(cart));
};

export const removeFromCart = (productId) => {
  const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : {};
  delete cart[productId];
  Cookies.set('cart', JSON.stringify(cart));
};