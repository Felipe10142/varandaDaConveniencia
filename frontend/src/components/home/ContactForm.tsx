import React, { useState } from 'react';
import { PhoneIcon, MailIcon, SendIcon, CheckIcon, MapPinIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContent from '../animations/AnimatedContent';
import FadeContent from '../animations/FadeContent';
import GlareHover from '../animations/GlareHover';
import AnimatedList from '../animations/AnimatedList';
type FormData = {
  name: string;
  email: string;
  message: string;
};
type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'faq'>('message');
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            message: ''
          });
        }, 3000);
      }, 1500);
    }
  };
  const faqItems = ['Qual o horário de funcionamento?', 'Vocês fazem entrega?', 'Qual o valor mínimo para delivery?', 'Quais formas de pagamento são aceitas?', 'Quanto tempo leva para entregar?', 'Vocês têm opções vegetarianas?', 'É possível agendar um pedido para outro dia?', 'Vocês têm cardápio para eventos?'];
  const handleFaqSelect = (item: string, index: number) => {
    console.log(`FAQ selected: ${item}`);
  };
  return <section id="contato" className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
      <div className="container mx-auto px-4">
        <AnimatedContent direction="vertical" distance={50} duration={0.8}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Entre em Contato
            </h2>
            <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Tem alguma dúvida ou sugestão? Envie-nos uma mensagem e
              responderemos o mais breve possível.
            </p>
          </div>
        </AnimatedContent>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/10 backdrop-blur-sm p-1 rounded-full">
              <motion.button className={`px-6 py-2 rounded-full transition-all ${activeTab === 'message' ? 'bg-white text-primary' : 'text-white'}`} onClick={() => setActiveTab('message')} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                Enviar Mensagem
              </motion.button>
              <motion.button className={`px-6 py-2 rounded-full transition-all ${activeTab === 'faq' ? 'bg-white text-primary' : 'text-white'}`} onClick={() => setActiveTab('faq')} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                Perguntas Frequentes
              </motion.button>
            </div>
          </div>
          <FadeContent blur={true} duration={1000}>
            <AnimatePresence mode="wait">
              {activeTab === 'message' ? <motion.div key="contact-form" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.3
            }} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 p-8 bg-white/10">
                      <AnimatedContent direction="horizontal" reverse={true} distance={30}>
                        <h3 className="text-2xl font-bold mb-6">
                          Informações de Contato
                        </h3>
                        <div className="space-y-6">
                          <div className="flex items-start">
                            <PhoneIcon className="w-5 h-5 mr-4 mt-1" />
                            <div>
                              <p className="font-medium">Telefone</p>
                              <p>(48) 99999-9999</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MailIcon className="w-5 h-5 mr-4 mt-1" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p>contato@varandadaconveniencia.com.br</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPinIcon className="w-5 h-5 mr-4 mt-1" />
                            <div>
                              <p className="font-medium">Endereço</p>
                              <p>
                                R. Aderbal Ramos da Silva, 1302
                                <br />
                                Enseada da Pinheira, Palhoça - SC
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-12">
                          <h4 className="font-medium mb-4">
                            Siga-nos nas redes sociais
                          </h4>
                          <div className="flex space-x-4">
                            <GlareHover width="40px" height="40px" background="rgba(255,255,255,0.2)" borderRadius="9999px" borderColor="transparent" glareColor="#ffffff" className="border-0">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </GlareHover>
                            <GlareHover width="40px" height="40px" background="rgba(255,255,255,0.2)" borderRadius="9999px" borderColor="transparent" glareColor="#ffffff" className="border-0">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                              </svg>
                            </GlareHover>
                          </div>
                        </div>
                      </AnimatedContent>
                    </div>
                    {/* Contact Form */}
                    <div className="lg:col-span-3 p-8">
                      {isSubmitted ? <motion.div className="flex flex-col items-center justify-center h-full text-center" initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }}>
                          <motion.div className="bg-success bg-opacity-10 p-4 rounded-full mb-4" initial={{
                      scale: 0
                    }} animate={{
                      scale: 1
                    }} transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 10
                    }}>
                            <CheckIcon className="w-12 h-12 text-success" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Mensagem Enviada!
                          </h3>
                          <p className="text-white/80">
                            Obrigado pelo contato. Responderemos em breve.
                          </p>
                        </motion.div> : <AnimatedContent direction="horizontal" distance={30}>
                          <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                              <label htmlFor="name" className="block text-white font-medium mb-2">
                                Nome
                              </label>
                              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-white/60 ${errors.name ? 'border-error' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`} placeholder="Seu nome completo" />
                              {errors.name && <p className="mt-1 text-error text-sm">
                                  {errors.name}
                                </p>}
                            </div>
                            <div className="mb-6">
                              <label htmlFor="email" className="block text-white font-medium mb-2">
                                Email
                              </label>
                              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-white/60 ${errors.email ? 'border-error' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`} placeholder="seu@email.com" />
                              {errors.email && <p className="mt-1 text-error text-sm">
                                  {errors.email}
                                </p>}
                            </div>
                            <div className="mb-6">
                              <label htmlFor="message" className="block text-white font-medium mb-2">
                                Mensagem
                              </label>
                              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-white/60 ${errors.message ? 'border-error' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`} placeholder="Sua mensagem aqui..."></textarea>
                              {errors.message && <p className="mt-1 text-error text-sm">
                                  {errors.message}
                                </p>}
                            </div>
                            <motion.button type="submit" disabled={isSubmitting} className="w-full bg-white hover:bg-white/90 text-primary font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center" whileHover={{
                        scale: 1.02
                      }} whileTap={{
                        scale: 0.98
                      }}>
                              {isSubmitting ? <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg> : <>
                                  <SendIcon className="w-5 h-5 mr-2" />
                                  Enviar Mensagem
                                </>}
                            </motion.button>
                          </form>
                        </AnimatedContent>}
                    </div>
                  </div>
                </motion.div> : <motion.div key="faq" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.3
            }} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6">
                        Perguntas Frequentes
                      </h3>
                      <p className="mb-6 text-white/80">
                        Confira abaixo as perguntas mais comuns dos nossos
                        clientes. Se não encontrar o que procura, entre em
                        contato conosco.
                      </p>
                      <AnimatedList items={faqItems} onItemSelect={handleFaqSelect} showGradients={true} enableArrowNavigation={true} displayScrollbar={true} className="w-full" itemClassName="hover:bg-white/10" />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="bg-white/5 p-8 rounded-xl">
                        <h4 className="text-xl font-bold mb-4">
                          Atendimento ao Cliente
                        </h4>
                        <p className="mb-6 text-white/80">
                          Nosso time está disponível para atendê-lo nos
                          seguintes horários:
                        </p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex justify-between">
                            <span>Segunda - Sexta:</span>
                            <span className="font-bold">09:00 - 22:00</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sábado:</span>
                            <span className="font-bold">09:00 - 23:00</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Domingo:</span>
                            <span className="font-bold">11:00 - 22:00</span>
                          </li>
                        </ul>
                        <div className="flex items-center justify-center space-x-4 mt-8">
                          <motion.a href="tel:+554899999999" className="flex items-center justify-center bg-white text-primary font-bold py-3 px-6 rounded-lg" whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.95
                      }}>
                            <PhoneIcon className="w-5 h-5 mr-2" />
                            Ligar Agora
                          </motion.a>
                          <motion.a href="mailto:contato@varandadaconveniencia.com.br" className="flex items-center justify-center bg-white/20 text-white font-bold py-3 px-6 rounded-lg" whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.95
                      }}>
                            <MailIcon className="w-5 h-5 mr-2" />
                            Email
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>
          </FadeContent>
        </div>
      </div>
    </section>;
};
export default ContactForm;