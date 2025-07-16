import React, { Children } from "react";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  InstagramIcon,
  FacebookIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import FadeContent from "../animations/FadeContent";
import AnimatedContent from "../animations/AnimatedContent";
import ClickSpark from "../animations/ClickSpark";
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
        >
          {/* Column 1: About */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Varanda da Conveniência</h3>
            <p className="mb-4 text-gray-300">
              O sabor e a praticidade da praia direto na sua casa. Oferecemos
              produtos de qualidade e serviço de excelência para nossos
              clientes.
            </p>
            <div className="flex space-x-4">
              <ClickSpark sparkColor="#F77F00" sparkRadius={20}>
                <motion.a
                  href="#"
                  className="text-white hover:text-secondary transition-colors"
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <InstagramIcon className="w-6 h-6" />
                </motion.a>
              </ClickSpark>
              <ClickSpark sparkColor="#F77F00" sparkRadius={20}>
                <motion.a
                  href="#"
                  className="text-white hover:text-secondary transition-colors"
                  whileHover={{
                    scale: 1.2,
                    rotate: -5,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <FacebookIcon className="w-6 h-6" />
                </motion.a>
              </ClickSpark>
            </div>
          </motion.div>
          {/* Column 2: Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <motion.li
                className="flex items-start"
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <PhoneIcon className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>(48) 99999-9999</span>
              </motion.li>
              <motion.li
                className="flex items-start"
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <MailIcon className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>contato@varandadaconveniencia.com.br</span>
              </motion.li>
              <motion.li
                className="flex items-start"
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <MapPinIcon className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>
                  R. Aderbal Ramos da Silva, 1302
                  <br />
                  Enseada da Pinheira, Palhoça - SC
                  <br />
                  CEP: 88138-351
                </span>
              </motion.li>
            </ul>
          </motion.div>
          {/* Column 3: Hours */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
            <AnimatedContent direction="horizontal" distance={30}>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Segunda - Sexta:</span>
                  <motion.span
                    whileHover={{
                      color: "#F77F00",
                    }}
                  >
                    09:00 - 22:00
                  </motion.span>
                </li>
                <li className="flex justify-between">
                  <span>Sábado:</span>
                  <motion.span
                    whileHover={{
                      color: "#F77F00",
                    }}
                  >
                    09:00 - 23:00
                  </motion.span>
                </li>
                <li className="flex justify-between">
                  <span>Domingo:</span>
                  <motion.span
                    whileHover={{
                      color: "#F77F00",
                    }}
                  >
                    11:00 - 22:00
                  </motion.span>
                </li>
                <li className="flex justify-between mt-4 pt-4 border-t border-gray-700">
                  <span>Delivery:</span>
                  <motion.span
                    whileHover={{
                      color: "#F77F00",
                    }}
                  >
                    11:00 - 21:00
                  </motion.span>
                </li>
              </ul>
            </AnimatedContent>
          </motion.div>
        </motion.div>
        <FadeContent delay={500} duration={1000}>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <motion.p
              initial={{
                opacity: 0.5,
              }}
              whileInView={{
                opacity: 1,
              }}
              transition={{
                duration: 1,
              }}
            >
              &copy; {currentYear} Varanda da Conveniência. Todos os direitos
              reservados.
            </motion.p>
          </div>
        </FadeContent>
      </div>
    </footer>
  );
};
export default Footer;
