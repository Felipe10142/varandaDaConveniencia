import React, { useState, useEffect } from 'react';
import ProductCard from "./ProductCard";
import { Product } from "../../contexts/CartContext";
import { motion } from "framer-motion";
import AnimatedContent from "../animations/AnimatedContent";
import FadeContent from "../animations/FadeContent";
import CountUp from "../animations/CountUp";
import { api } from '../../services/api';

const categories = ["Todos", "Frangos", "Marmitas", "Bebidas"];

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get<Product[]>('/products');
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar os produtos. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <section id="produtos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedContent direction="vertical" distance={50} duration={0.8}>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark">
              Nossos Produtos
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-gray text-lg max-w-2xl mx-auto">
              Conheça nossa variedade de produtos frescos e saborosos,
              preparados com carinho para você e sua família.
            </p>
          </div>
        </AnimatedContent>
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-6 py-2 rounded-full font-medium text-sm md:text-base transition-colors ${activeCategory === category ? "bg-primary text-white" : "bg-white text-gray hover:bg-gray-100"}`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
          <FadeContent blur={true} duration={1000}>
            <div className="hidden md:flex items-center space-x-8 bg-white p-3 rounded-lg shadow-sm">
              <div className="text-center">
                <p className="text-gray text-sm">Clientes</p>
                <p className="text-2xl font-bold text-primary">
                  <CountUp from={0} to={1500} separator="." duration={2} />+
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray text-sm">Pedidos</p>
                <p className="text-2xl font-bold text-secondary">
                  <CountUp from={0} to={8700} separator="." duration={2} />+
                </p>
              </div>
            </div>
          </FadeContent>
        </div>

        {loading && <p className="text-center">Carregando produtos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default ProductGrid;
