import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../contexts/CartContext';
import { motion } from 'framer-motion';
import AnimatedContent from '../animations/AnimatedContent';
import FadeContent from '../animations/FadeContent';
import CountUp from '../animations/CountUp';
// Mock products data
const mockProducts: Product[] = [{
  id: '1',
  name: 'Frango Assado Completo',
  description: 'Frango inteiro assado com temperos especiais, acompanha batatas.',
  price: 45.9,
  image: "/image.png",
  category: 'Frangos'
}, {
  id: '2',
  name: 'Marmita Tradicional',
  description: 'Arroz, feijão, filé de frango grelhado, salada e farofa.',
  price: 22.9,
  image: "/image.png",
  category: 'Marmitas'
}, {
  id: '3',
  name: 'Marmita Executiva',
  description: 'Arroz, feijão, bife acebolado, purê de batatas e legumes.',
  price: 27.9,
  image: "/image.png",
  category: 'Marmitas'
}, {
  id: '4',
  name: 'Refrigerante 2L',
  description: 'Refrigerante gelado, diversas marcas disponíveis.',
  price: 12.9,
  image: "/image.png",
  category: 'Bebidas'
}, {
  id: '5',
  name: 'Água Mineral 500ml',
  description: 'Água mineral sem gás, garrafa individual.',
  price: 3.5,
  image: "/image.png",
  category: 'Bebidas'
}, {
  id: '6',
  name: 'Frango Assado Meio',
  description: 'Meio frango assado com temperos especiais.',
  price: 25.9,
  image: "/image.png",
  category: 'Frangos'
}, {
  id: '7',
  name: 'Cerveja Long Neck',
  description: 'Cerveja gelada, diversas marcas disponíveis.',
  price: 8.9,
  image: "/image.png",
  category: 'Bebidas'
}, {
  id: '8',
  name: 'Marmita Vegetariana',
  description: 'Arroz, feijão, legumes grelhados, salada e proteína vegetal.',
  price: 24.9,
  image: "/image.png",
  category: 'Marmitas'
}];
const categories = ['Todos', 'Frangos', 'Marmitas', 'Bebidas'];
const ProductGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const filteredProducts = activeCategory === 'Todos' ? mockProducts : mockProducts.filter(product => product.category === activeCategory);
  return <section id="produtos" className="py-20 bg-gray-50">
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
            {categories.map(category => <motion.button key={category} className={`px-6 py-2 rounded-full font-medium text-sm md:text-base transition-colors ${activeCategory === category ? 'bg-primary text-white' : 'bg-white text-gray hover:bg-gray-100'}`} onClick={() => setActiveCategory(category)} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                {category}
              </motion.button>)}
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
          {filteredProducts.map((product, index) => <motion.div key={product.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
              <ProductCard product={product} />
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default ProductGrid;