import { ArrowRight, Handshake, MessageCircle, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionBadge from './ui/SectionBadge';
import { useNavigate } from 'react-router-dom';
import { useContactLeadModal } from '../context/ContactLeadModalContext';

const HomePartners = () => {
    const navigate = useNavigate();
    const { openContactModal } = useContactLeadModal();

    return (
        <section className="relative w-full text-white pt-10 pb-24 md:py-32 z-10">
            
            {/* Background Fundo Terra */}
            <div className="absolute -top-16 md:-top-32 left-0 right-0 w-full h-[110%] md:h-[130%] z-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black via-black/80 to-transparent z-10"></div>
                <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black via-black/90 to-transparent z-10"></div>
                <img 
                    src="/background/bg-final-home.jpg"
                    alt="Fundo Terra"
                    className="absolute inset-0 w-full h-full object-cover object-top mix-blend-screen opacity-90"
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                
                <div className="flex flex-col items-center text-center mb-16">
                    <SectionBadge variant="overlay" icon={<Rocket className="w-4 h-4" />}>PRÓXIMOS PASSOS</SectionBadge>
                    <h2 className="text-3xl md:text-5xl font-bold mt-4">
                        Pronto para <br className="block md:hidden" /> o próximo nível?
                    </h2>
                </div>

                {/* Blocos de Ação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto mb-20">
                    
                    {/* Bloco: Fale com a Equipe */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="bg-black/40 backdrop-blur-sm border-[3px] border-white/10 rounded-none p-8 flex flex-col items-center text-center hover:bg-black/60 hover:border-primary-500/40 transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 relative z-10">
                            <MessageCircle className="w-8 h-8 text-primary-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 relative z-10">Fale com nossos especialistas</h3>
                        <p className="text-gray-400 mb-8 flex-grow relative z-10">
                            Converse diretamente com nosso time pelo WhatsApp e descubra como podemos impulsionar os seus resultados.
                        </p>
                        <button 
                            onClick={() => openContactModal({
                                redirectUrl: 'https://wa.me/5521998689659?text=Ol%C3%A1%21%20Vi%20a%20se%C3%A7%C3%A3o%20de%20especialistas%20no%20site%20da%20RX%20e%20gostaria%20de%20saber%20como%20voc%C3%AAs%20podem%20impulsionar%20meus%20resultados.',
                                prefilledData: { type: 'Contato de Especialista' }
                            })}
                            className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-none font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center relative z-10 cursor-pointer"
                        >
                            Falar no WhatsApp
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </motion.div>

                    {/* Bloco: Seja um Parceiro */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-black/40 backdrop-blur-sm border-[3px] border-white/10 rounded-none p-8 flex flex-col items-center text-center hover:bg-black/60 hover:border-primary-500/40 transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 relative z-10">
                            <Handshake className="w-8 h-8 text-primary-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 relative z-10">Seja um Parceiro</h3>
                        <p className="text-gray-400 mb-8 flex-grow relative z-10">
                            Faça parte do RX Partner Program, acesse novas oportunidades de negócio e aumente sua receita.
                        </p>
                        <button 
                            onClick={() => navigate('/parceiros#partner-program')}
                            className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-none font-semibold transition-colors flex items-center justify-center cursor-pointer relative z-10"
                        >
                            Partner Program
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default HomePartners;
