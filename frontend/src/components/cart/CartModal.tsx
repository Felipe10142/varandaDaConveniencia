import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import {
  XIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "../animations/GradientText";
import CountUp from "../animations/CountUp";
const CartModal: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Idealmente, aquí se debería redirigir al login
      // o mostrar un modal para iniciar sesión.
      alert("Você precisa estar logado para finalizar o pedido.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Crear el pedido en el backend
      const orderResponse = await apiService.createOrder({
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: { // Dirección de ejemplo, esto debería venir del perfil del usuario
          street: "Rua Principal, 123",
          city: "Pinheira",
          state: "SC",
          zipCode: "88130-000",
        },
        paymentMethod: "card",
      });

      const orderId = orderResponse.data._id;

      // 2. Crear la sesión de checkout de Stripe
      const checkoutResponse = await apiService.createCheckoutSession({
        orderItems: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        orderId: orderId,
      });

      // 3. Redirigir a la página de pago de Stripe
      window.location.href = checkoutResponse.data.url;

    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCartOpen) return null;
  const backdropVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };
  const cartVariants = {
    hidden: {
      x: "100%",
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      transition: {
        ease: "easeInOut",
        duration: 0.3,
      },
    },
  };
  const cartItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };
  const btnHoverEffect = {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  };
  const btnTapEffect = {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
      >
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeCart}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        ></motion.div>
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <motion.div
            className="relative w-screen max-w-md"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="h-full flex flex-col bg-gradient-to-br from-primary to-secondary shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-6 text-white">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingBagIcon className="w-6 h-6 mr-2" />
                  <GradientText colors={["#ffffff", "#f8f8f8", "#ffffff"]}>
                    Seu Carrinho
                  </GradientText>
                </h2>
                <motion.button
                  onClick={closeCart}
                  className="text-white hover:text-white/80 transition-colors"
                  whileHover={btnHoverEffect}
                  whileTap={btnTapEffect}
                >
                  <XIcon className="w-6 h-6" />
                </motion.button>
              </div>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-white"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.3,
                      },
                    }}
                  >
                    <motion.div
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.4,
                      }}
                    >
                      <ShoppingBagIcon className="w-20 h-20 mb-6 text-white/30" />
                    </motion.div>
                    <p className="text-xl font-medium">
                      Seu carrinho está vazio
                    </p>
                    <p className="text-sm mt-2 mb-6 text-white/70">
                      Adicione alguns produtos para começar
                    </p>
                    <motion.button
                      onClick={closeCart}
                      className="mt-6 bg-white text-primary font-bold px-6 py-3 rounded-full transition-colors hover:bg-white/90"
                      whileHover={btnHoverEffect}
                      whileTap={btnTapEffect}
                    >
                      Continuar Comprando
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product._id}
                        custom={index}
                        variants={cartItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center bg-white/10 p-4 rounded-lg text-white backdrop-blur-sm"
                        layoutId={`cart-item-${item.product._id}`}
                      >
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          <motion.div
                            className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500"
                            whileHover={{
                              scale: 1.1,
                            }}
                            transition={{
                              duration: 0.3,
                            }}
                          >
                            {item.product.name.charAt(0)}
                          </motion.div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium">
                            {item.product.name}
                          </h3>
                          <p className="text-sm font-bold mt-1 text-white">
                            R$ {item.product.price.toFixed(2).replace(".", ",")}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-white/20 rounded-full overflow-hidden">
                              <motion.button
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    item.quantity - 1,
                                  )
                                }
                                className="px-2 py-1 hover:bg-white/10 transition-colors"
                                whileHover={{
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                }}
                                whileTap={btnTapEffect}
                              >
                                <MinusIcon className="w-4 h-4" />
                              </motion.button>
                              <span className="px-3 py-1 font-medium">
                                <CountUp
                                  from={item.quantity - 1}
                                  to={item.quantity}
                                  duration={0.5}
                                />
                              </span>
                              <motion.button
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-2 py-1 hover:bg-white/10 transition-colors"
                                whileHover={{
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                }}
                                whileTap={btnTapEffect}
                              >
                                <PlusIcon className="w-4 h-4" />
                              </motion.button>
                            </div>
                            <motion.button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-white/70 hover:text-white transition-colors"
                              whileHover={{
                                scale: 1.1,
                              }}
                              whileTap={{
                                scale: 0.9,
                              }}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  className="border-t border-white/20 p-4"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.5,
                    },
                  }}
                >
                  <div className="flex justify-between text-lg font-bold mb-4 text-white">
                    <span>Total</span>
                    <span>
                      R${" "}
                      <CountUp
                        from={0}
                        to={totalPrice}
                        duration={0.5}
                        separator=","
                      />
                    </span>
                  </div>
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="w-full bg-white hover:bg-white/90 text-primary font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={btnHoverEffect}
                      whileTap={btnTapEffect}
                    >
                      {isLoading ? 'Processando...' : 'Finalizar Pedido'}
                    </motion.button>
                    <motion.button
                      onClick={clearCart}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      whileHover={btnHoverEffect}
                      whileTap={btnTapEffect}
                    >
                      Limpar Carrinho
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default CartModal;
