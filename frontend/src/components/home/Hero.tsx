import React from "react";
import { motion } from "framer-motion";
import SplitText from "../animations/SplitText";
import BlurText from "../animations/BlurText";
import FadeContent from "../animations/FadeContent";
import PixelTransition from "../animations/PixelTransition";
import ClickSpark from "../animations/ClickSpark";
const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary via-secondary to-primary animate-gradient px-2 md:px-0">
      {/* Gradient background instead of image */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary via-secondary to-primary animate-gradient"
        style={{ backgroundSize: "300% 300%" }}
      ></div>
      <div className="relative w-full max-w-3xl mx-auto flex flex-col justify-center items-center text-white text-center z-10 py-16 md:py-32">
        <ClickSpark
          sparkColor="#ffffff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 w-full"
          >
            <SplitText
              text="Varanda da Conveniência"
              className="text-3xl sm:text-4xl md:text-6xl font-accent mb-4"
              delay={100}
              duration={0.8}
              ease="power3.out"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
            />
          </motion.div>
          <BlurText
            text="O sabor e a praticidade da praia direto na sua casa"
            delay={150}
            animateBy="words"
            direction="bottom"
            className="text-lg sm:text-xl md:text-2xl mb-10 font-condensed tracking-wider"
          />
          <motion.button
            className="bg-white text-primary hover:bg-white/90 font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full transition-colors duration-300 text-base sm:text-lg transform hover:scale-105 shadow-lg mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("produtos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Fazer pedido
          </motion.button>
          <FadeContent
            blur={true}
            duration={1500}
            delay={500}
            className="mt-6 flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
          >
            <PixelTransition
              firstContent={
                <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
                  <p className="text-white font-bold text-base sm:text-lg">
                    Entregas Rápidas
                  </p>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex items-center justify-center bg-primary p-4">
                  <p className="text-white font-bold text-base sm:text-lg">
                    Em até 30 minutos
                  </p>
                </div>
              }
              gridSize={8}
              pixelColor="#ffffff"
              className="w-full sm:w-[200px] h-[80px] sm:h-[100px] border-0"
              style={{ aspectRatio: "2/1" }}
            />
            <PixelTransition
              firstContent={
                <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
                  <p className="text-white font-bold text-base sm:text-lg">
                    Produtos Frescos
                  </p>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex items-center justify-center bg-secondary p-4">
                  <p className="text-white font-bold text-base sm:text-lg">
                    Qualidade Garantida
                  </p>
                </div>
              }
              gridSize={8}
              pixelColor="#ffffff"
              className="w-full sm:w-[200px] h-[80px] sm:h-[100px] border-0"
              style={{ aspectRatio: "2/1" }}
            />
          </FadeContent>
        </ClickSpark>
      </div>
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </div>
  );
};
export default Hero;
