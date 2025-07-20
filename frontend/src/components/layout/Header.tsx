import React, { useEffect, useState, Children } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "../animations/GradientText";
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { openCart, totalItems } = useCart();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Close mobile menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };
  const menuItems = [
    {
      id: "inicio",
      label: "Início",
      link: "/",
    },
    {
      id: "quem-somos",
      label: "Quem Somos",
      action: () => scrollToSection("quem-somos"),
    },
    {
      id: "produtos",
      label: "Produtos",
      action: () => scrollToSection("produtos"),
    },
    {
      id: "avaliacoes",
      label: "Avaliações",
      action: () => scrollToSection("avaliacoes"),
    },
    {
      id: "localizacao",
      label: "Localização",
      action: () => scrollToSection("localizacao"),
    },
    {
      id: "contato",
      label: "Contato",
      action: () => scrollToSection("contato"),
    },
  ];
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-gradient-to-r from-primary via-secondary to-primary py-2 shadow-lg" : "bg-gradient-to-r from-primary/80 via-secondary/80 to-primary/80 backdrop-blur-sm py-4"}`;
  const navItemVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };
  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };
  const mobileItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };
  const logoVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: {
        yoyo: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };
  return (
    <header className={headerClasses}>
      <div
        className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${isScrolled ? "bg-gradient-to-r from-primary to-secondary shadow-lg" : "bg-gradient-to-r from-primary to-secondary/80"}`}
      >
        <div className="container mx-auto flex flex-row items-center justify-between px-4 py-2 md:py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-white font-accent text-2xl font-bold whitespace-nowrap"
          >
            <span className="bg-black px-2 py-1 rounded-lg mr-2">
              Varanda da Conveniência
            </span>
          </Link>
          {/* Desktop Menu */}
          <nav className="hidden md:flex flex-row gap-4 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action ? item.action : undefined}
                className="text-white font-medium hover:text-accent transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {item.label}
              </button>
            ))}
          </nav>
          {/* User/Cart/Menu */}
          <div className="flex flex-row items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <motion.button
                  className="flex items-center text-white hover:text-white/80 transition-colors"
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <UserIcon className="w-5 h-5 mr-1" />
                  <span className="hidden md:inline">{user?.name}</span>
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </motion.button>
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-primary to-secondary rounded-md shadow-lg py-1 z-50 hidden group-hover:block transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      Área do Administrador
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-white hover:text-white/80 transition-colors"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="flex items-center"
                >
                  <UserIcon className="w-5 h-5 mr-1" />
                  <span className="hidden md:inline">Entrar</span>
                </motion.div>
              </Link>
            )}

            <motion.button
              onClick={openCart}
              className="relative flex items-center text-white hover:text-white/80 transition-colors"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    exit={{
                      scale: 0,
                    }}
                    className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white hover:text-white/80 transition-colors ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="md:hidden bg-gradient-to-r from-primary to-secondary px-4 py-4 flex flex-col gap-2 shadow-lg"
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action ? item.action : undefined}
                  className="text-white font-medium text-lg py-2 px-2 rounded hover:bg-white/10 transition-colors text-left w-full"
                >
                  {item.label}
                </button>
              ))}
              {/* User/Logout en menú móvil */}
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="text-white font-medium text-lg py-2 px-2 rounded hover:bg-white/10 transition-colors text-left w-full mt-2"
                >
                  Sair
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
export default Header;
