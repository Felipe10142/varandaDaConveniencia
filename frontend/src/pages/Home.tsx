import React from 'react';
import Hero from '../components/home/Hero';
import QuemSomos from '../components/home/QuemSomos';
import ProductGrid from '../components/products/ProductGrid';
import CartModal from '../components/cart/CartModal';
import Testimonials from '../components/home/Testimonials';
import LocationMap from '../components/home/LocationMap';
import ContactForm from '../components/home/ContactForm';
import { useCart } from '../contexts/CartContext';
const HomePage: React.FC = () => {
  const {
    isCartOpen
  } = useCart();
  return <>
      <Hero />
      <QuemSomos />
      <ProductGrid />
      <Testimonials />
      <LocationMap />
      <ContactForm />
      {isCartOpen && <CartModal />}
    </>;
};
export default HomePage;