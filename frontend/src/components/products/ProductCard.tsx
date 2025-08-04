import React, { useState } from "react";
import { PlusIcon, EyeIcon, XIcon } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import ClickSpark from "../animations/ClickSpark";
import { Product } from "../../hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showPreview, setShowPreview] = useState(false);
  
  const handleAddToCart = () => {
    // Convert Product to CartProduct format
    const cartProduct = {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.images[0] || "/image.png",
      category: product.category,
    };
    addToCart(cartProduct);
  };

  return (
    <ClickSpark>
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold">
            {product.name.charAt(0)}
          </div>
          {/* Animated Tag */}
          <motion.div
            className="absolute top-2 left-2 bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded-lg z-10"
            initial={{
              scale: 0,
            }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [-10, 10, 0],
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.6, 1],
            }}
          >
            {product.category}
          </motion.div>
          <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-2 py-1 rounded">
            {product.category}
          </div>
        </div>
        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-bold text-dark mb-2">{product.name}</h3>
          <p className="text-gray text-sm mb-4 flex-grow">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-primary font-bold text-xl">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            <div className="flex space-x-2">
              <motion.button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-colors"
                onClick={() => setShowPreview(true)}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
              >
                <EyeIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="bg-primary hover:bg-secondary text-white p-2 rounded-full transition-colors"
                onClick={handleAddToCart}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
              >
                <PlusIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
        {/* Product Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => setShowPreview(false)}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              />
              <motion.div
                className="bg-white rounded-lg shadow-xl max-w-md w-full z-10 overflow-hidden"
                initial={{
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.9,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                }}
              >
                <div className="relative h-56 bg-gray-200">
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-4xl font-bold">
                    {product.name.charAt(0)}
                  </div>
                  <motion.button
                    className="absolute top-2 right-2 bg-white text-gray p-2 rounded-full"
                    onClick={() => setShowPreview(false)}
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                  >
                    <XIcon className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-dark mb-2">
                    {product.name}
                  </h2>
                  <div className="mb-4">
                    <span className="inline-block bg-primary text-white text-sm font-bold px-2 py-1 rounded mr-2">
                      {product.category}
                    </span>
                    <span className="text-primary font-bold text-xl">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Descrição</h3>
                    <p className="text-gray">{product.description}</p>
                  </div>
                  {product.nutritionalInfo && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-2">Informação Nutricional</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Calorias: {product.nutritionalInfo.calories}</div>
                        <div>Proteínas: {product.nutritionalInfo.proteins}g</div>
                        <div>Carboidratos: {product.nutritionalInfo.carbs}g</div>
                        <div>Gorduras: {product.nutritionalInfo.fats}g</div>
                      </div>
                    </div>
                  )}
                  <motion.button
                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      handleAddToCart();
                      setShowPreview(false);
                    }}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    Adicionar ao Carrinho
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClickSpark>
  );
};

export default ProductCard;
