import React, { useState } from 'react';
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import AnimatedContent from "../animations/AnimatedContent";
import FadeContent from "../animations/FadeContent";
import CountUp from "../animations/CountUp";
import { useProducts } from '../../hooks/useProducts';

const categories = ["Todos", "Frangos", "Marmitas", "Bebidas"];

const ProductGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { products, loading, error, getProductsByCategory } = useProducts();
  
  const filteredProducts = getProductsByCategory(activeCategory);

  if (loading) {
    return (
      <section id="produtos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="produtos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar produtos: {error}</p>
          </div>
        </div>
      </section>
    );
  }

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
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
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
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
