import React, { useEffect, useState, Children } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import GradientText from '../animations/GradientText';
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const {
    user,
    isAuthenticated,
    isAdmin,
    logout
  } = useAuth();
  const {
    openCart,
    totalItems
  } = useCart();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close mobile menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };
  const menuItems = [{
    id: 'inicio',
    label: 'Início',
    link: '/'
  }, {
    id: 'quem-somos',
    label: 'Quem Somos',
    action: () => scrollToSection('quem-somos')
  }, {
    id: 'produtos',
    label: 'Produtos',
    action: () => scrollToSection('produtos')
  }, {
    id: 'avaliacoes',
    label: 'Avaliações',
    action: () => scrollToSection('avaliacoes')
  }, {
    id: 'localizacao',
    label: 'Localização',
    action: () => scrollToSection('localizacao')
  }, {
    id: 'contato',
    label: 'Contato',
    action: () => scrollToSection('contato')
  }];
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-gradient-to-r from-primary via-secondary to-primary py-2 shadow-lg' : 'bg-gradient-to-r from-primary/80 via-secondary/80 to-primary/80 backdrop-blur-sm py-4'}`;
  const navItemVariants = {
    hidden: {
      opacity: 0,
      y: -10
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };
  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  const mobileItemVariants = {
    closed: {
      opacity: 0,
      x: -20
    },
    open: {
      opacity: 1,
      x: 0
    }
  };
  const logoVariants = {
    initial: {
      scale: 1
    },
    hover: {
      scale: 1.05,
      transition: {
        yoyo: Infinity,
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };
  return <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div initial="initial" whileHover="hover" variants={logoVariants}>
          <Link to="/" className="relative z-10">
            <GradientText colors={['#ffffff', '#f8f8f8', '#ffffff']} animationSpeed={5} className="text-2xl font-accent" showBorder={true}>
              Varanda da Conveniência
            </GradientText>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {menuItems.map((item, i) => <motion.div key={item.id} custom={i} initial="hidden" animate="visible" variants={navItemVariants} onHoverStart={() => setHoveredItem(item.id)} onHoverEnd={() => setHoveredItem(null)} className="relative px-3 py-2">
              {item.link ? <Link to={item.link} className={`text-white font-medium transition-all duration-300 ${hoveredItem === item.id ? 'text-white' : 'text-white/90'}`}>
                  <motion.span initial={{
              scale: 1
            }} animate={{
              scale: hoveredItem === item.id ? 1.1 : 1
            }} transition={{
              duration: 0.2
            }}>
                    {item.label}
                  </motion.span>
                </Link> : <button onClick={item.action} className={`text-white font-medium transition-all duration-300 ${hoveredItem === item.id ? 'text-white' : 'text-white/90'}`}>
                  <motion.span initial={{
              scale: 1
            }} animate={{
              scale: hoveredItem === item.id ? 1.1 : 1
            }} transition={{
              duration: 0.2
            }}>
                    {item.label}
                  </motion.span>
                </button>}
              <AnimatePresence>
                {hoveredItem === item.id && <motion.div initial={{
              width: 0,
              opacity: 0
            }} animate={{
              width: '100%',
              opacity: 1
            }} exit={{
              width: 0,
              opacity: 0
            }} className="absolute bottom-0 left-0 h-1 bg-white rounded-full" style={{
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
            }} />}
              </AnimatePresence>
            </motion.div>)}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4 relative z-10">
          {isAuthenticated ? <div className="relative group">
              <motion.button className="flex items-center text-white hover:text-white/80 transition-colors" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                <UserIcon className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">{user?.name}</span>
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </motion.button>
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-primary to-secondary rounded-md shadow-lg py-1 z-50 hidden group-hover:block transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200">
                {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm text-white hover:bg-white/10">
                    Área do Administrador
                  </Link>}
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">
                  Sair
                </button>
              </div>
            </div> : <Link to="/login" className="flex items-center text-white hover:text-white/80 transition-colors">
              <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="flex items-center">
                <UserIcon className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">Entrar</span>
              </motion.div>
            </Link>}

          <motion.button onClick={openCart} className="relative flex items-center text-white hover:text-white/80 transition-colors" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <ShoppingCartIcon className="w-5 h-5" />
            <AnimatePresence>
              {totalItems > 0 && <motion.span initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} exit={{
              scale: 0
            }} className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </motion.span>}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button className="md:hidden text-white hover:text-white/80 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && <motion.div className="md:hidden bg-gradient-to-b from-primary to-secondary shadow-lg overflow-hidden" initial="closed" animate="open" exit="closed" variants={mobileMenuVariants}>
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                {menuItems.map((item, i) => <motion.div key={item.id} variants={mobileItemVariants}>
                    {item.link ? <Link to={item.link} className="text-white hover:text-white/80 transition-colors block py-2">
                        {item.label}
                      </Link> : <button onClick={item.action} className="text-left text-white hover:text-white/80 transition-colors block w-full py-2">
                        {item.label}
                      </button>}
                  </motion.div>)}
              </nav>
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
};
export default Header;