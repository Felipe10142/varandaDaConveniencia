import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "../animations/GradientText";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";
import RotatingText from "../animations/RotatingText";
import ScrollVelocity from "../animations/ScrollVelocity";
type Testimonial = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
};
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "João Silva",
    avatar: "/image.png",
    rating: 5,
    comment:
      "O melhor frango assado da região! Entrega rápida e comida sempre quentinha. Recomendo muito!",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    avatar: "/image.png",
    rating: 5,
    comment:
      "As marmitas são deliciosas e bem servidas. Peço toda semana para o almoço no trabalho. Atendimento excelente!",
  },
  {
    id: "3",
    name: "Pedro Santos",
    avatar: "/image.png",
    rating: 4,
    comment:
      "Ótimo custo-benefício. A comida é caseira e saborosa. Só acho que poderiam ampliar o cardápio.",
  },
  {
    id: "4",
    name: "Ana Costa",
    avatar: "/image.png",
    rating: 5,
    comment:
      "Ambiente aconchegante e atendimento familiar. Sempre que vou à praia passo para comprar o frango assado.",
  },
];
const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
  };
  useEffect(() => {
    if (isAutoPlaying) startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, currentIndex]);
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex: number) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex: number) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };
  const transition = {
    x: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
    opacity: {
      duration: 0.2,
    },
  };
  const rotatingTexts = [
    "Clientes Satisfeitos",
    "Experiências Incríveis",
    "Avaliações Positivas",
    "Depoimentos Reais",
  ];
  return (
    <section
      id="avaliacoes"
      className="py-20 bg-gradient-to-r from-primary via-secondary to-primary text-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <GradientText
            colors={["#ffffff", "#f8f8f8", "#ffffff"]}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            O Que Nossos Clientes Dizem
          </GradientText>
          <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
        </div>
        <div className="mb-12">
          <ScrollVelocity
            texts={[
              "Avaliações • Depoimentos • Experiências • Satisfação • Qualidade • Confiança",
            ]}
            velocity={40}
            className="text-white/80 font-bold"
            numCopies={3}
          />
        </div>
        <div className="mb-8">
          <RotatingText
            text={rotatingTexts[0]}
            className="px-2 sm:px-2 md:px-3 bg-white/10 backdrop-blur-sm text-white overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg text-xl sm:text-2xl md:text-3xl font-bold mx-auto w-fit block"
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-10 px-4">
            <motion.button
              onClick={handlePrev}
              className="bg-white/10 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/20 transition-colors"
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={handleNext}
              className="bg-white/10 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/20 transition-colors"
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </motion.button>
          </div>
          {/* Carousel */}
          <div className="relative overflow-hidden h-[350px] md:h-[300px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-3xl">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
                      <motion.img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                        initial={{
                          scale: 1,
                        }}
                        whileHover={{
                          scale: 1.1,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold">
                        {testimonials[currentIndex].name}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start mt-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? "text-yellow-300 fill-current" : "text-white/30"}`}
                          />
                        ))}
                      </div>
                      <p className="text-white/90 text-lg italic">
                        "{testimonials[currentIndex].comment}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
