import React from "react";
import { motion } from "framer-motion";
import GradientText from "../animations/GradientText";
import ScrollReveal from "../animations/ScrollReveal";
import AnimatedContent from "../animations/AnimatedContent";
import FadeContent from "../animations/FadeContent";
import CountUp from "../animations/CountUp";
import GlareHover from "../animations/GlareHover";
const QuemSomos: React.FC = () => {
  return (
    <section id="quem-somos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image column */}
          <AnimatedContent
            direction="horizontal"
            reverse={true}
            duration={0.8}
            className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-12"
          >
            <div className="relative">
              <GlareHover
                width="100%"
                height="auto"
                background="transparent"
                borderRadius="0.5rem"
                glareColor="#D62828"
                glareOpacity={0.4}
                glareSize={200}
                className="rounded-lg overflow-hidden shadow-xl"
              >
                <motion.img
                  src="/image.png"
                  alt="Família Varanda da Conveniência"
                  className="w-full h-auto"
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                />
              </GlareHover>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg shadow-lg hidden md:block"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                }}
              >
                <p className="font-bold text-xl">
                  Desde <CountUp from={2000} to={2010} duration={2} />
                </p>
                <p>Servindo com amor</p>
              </motion.div>
            </div>
          </AnimatedContent>
          {/* Text column */}
          <AnimatedContent
            direction="horizontal"
            duration={0.8}
            delay={0.2}
            className="w-full md:w-1/2"
          >
            <GradientText className="text-3xl md:text-4xl font-bold mb-6">
              Quem Somos
            </GradientText>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mb-8"></div>
            <ScrollReveal
              enableBlur={true}
              baseOpacity={0.4}
              baseRotation={1}
              containerClassName="mb-6"
            >
              Bem-vindo à Varanda da Conveniência, um negócio familiar que
              nasceu do amor pela gastronomia e pelo atendimento de qualidade.
              Localizado na bela praia Enseada da Pinheira, em Palhoça, Santa
              Catarina, nosso estabelecimento combina o melhor da culinária
              local com a praticidade que você precisa.
            </ScrollReveal>
            <ScrollReveal
              enableBlur={true}
              baseOpacity={0.4}
              baseRotation={1}
              containerClassName="mb-6"
            >
              Nossa história começou em 2010, quando a família Silva decidiu
              transformar sua paixão por servir em um negócio que pudesse
              atender às necessidades dos moradores e visitantes da região.
              Desde então, temos nos dedicado a oferecer produtos frescos,
              refeições saborosas e um atendimento que faz você se sentir em
              casa.
            </ScrollReveal>
            <ScrollReveal enableBlur={true} baseOpacity={0.4} baseRotation={1}>
              Nosso compromisso é com a qualidade e a satisfação dos nossos
              clientes. Cada prato é preparado com ingredientes selecionados e
              muito carinho, mantendo o sabor autêntico da comida caseira que
              todos amam.
            </ScrollReveal>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};
export default QuemSomos;
