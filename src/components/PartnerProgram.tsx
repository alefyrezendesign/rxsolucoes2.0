import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Star, Zap, Crown, Handshake } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { usePartnerModal } from '../hooks/usePartnerModal';



const PartnerProgram = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { openModal } = usePartnerModal();

    const plans = [
        {
            name: "RX Mais",
            icon: <Star className="w-6 h-6 text-gray-400" />,
            badge: "Para iniciantes",
            description: "Ideal para quem está começando na parceria e quer iniciar sua atuação dentro do ecossistema RX com mais estrutura.",
            features: [
                "Selo RX Partner",
                "Presença em materiais digitais",
                "Indicações espontâneas"
            ],
            color: "border-white/10 bg-[#0a0a0c]",
            btnStyle: "bg-white/5 hover:bg-white/10 text-white border-[3px] border-white/10"
        },
        {
            name: "RX Pro",
            icon: <Zap className="w-6 h-6 text-primary-400" />,
            badge: "Mais Popular",
            description: "Para parceiros que buscam escalar sua atuação com mais visibilidade, geração de oportunidades e presença comercial mais ativa.",
            features: [
                "Geração de 15 leads por mês",
                "5 reuniões mensais",
                "Selo RX Pro",
                "Destaque mensal em redes sociais",
                "Benefícios em feiras"
            ],
            color: "border-primary-500/50 bg-primary-900/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] transform md:-translate-y-4 relative z-10",
            btnStyle: "bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]",
            popular: true
        },
        {
            name: "RX Elite",
            icon: <Crown className="w-6 h-6 text-yellow-400" />,
            badge: "Para líderes",
            description: "Para parceiros estratégicos com maior capacidade de operação comercial e foco em crescimento com mais alcance e relevância no ecossistema.",
            features: [
                "25 leads por mês",
                "15 reuniões mensais",
                "Selo RX Elite",
                "Destaque recorrente nas redes",
                "Participação em feiras",
                "Podcast trimestral"
            ],
            color: "border-yellow-500/30 bg-[#0a0a0c]",
            btnStyle: "bg-white/5 hover:bg-white/10 text-white border-[3px] border-yellow-500/30"
        }
    ];

    return (
        <section id="partner-program" className="flex flex-col justify-center pt-4 pb-12 md:pt-16 md:pb-16 bg-black relative overflow-visible" ref={ref}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-16 md:mb-24"
                >
                    <SectionBadge icon={<Handshake className="w-4 h-4" />}>
                        RX Partner Program
                    </SectionBadge>

                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white tracking-tight">
                        Parcerias que ampliam alcance <br className="hidden md:block" />
                        <span className="text-white">e geram oportunidades.</span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto px-2 md:px-0">
                        O RX Partner Program conecta especialistas, empresas e oportunidades dentro do ecossistema RX. É a frente dedicada a parceiros que querem crescer em conjunto, com mais estrutura, conexão e potencial de geração de valor.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mx-auto items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className={`rounded-none border-[3px] p-8 flex flex-col h-full backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] ${plan.color}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-none text-xs font-bold text-white tracking-wider shadow-lg">
                                    MAIS ESCOLHIDO
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                {plan.icon}
                            </div>
                            
                            <div className="text-sm font-medium text-primary-400 mb-4 uppercase tracking-wider">
                                {plan.badge}
                            </div>
                            
                            <p className="text-gray-400 font-light text-sm mb-8 min-h-[60px]">
                                {plan.description}
                            </p>
                            
                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary-400' : 'text-gray-500'}`} />
                                        <span className="text-gray-300 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={() => openModal(plan.name)}
                                className={`w-full py-3 sm:py-4 rounded-none text-center font-bold tracking-wide transition-all duration-300 cursor-pointer text-sm sm:text-base ${plan.btnStyle}`}
                            >
                                Iniciar parceria
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnerProgram;
