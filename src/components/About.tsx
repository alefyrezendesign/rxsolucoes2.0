import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Network, TrendingUp, Cpu, Info } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';

const About = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const features = [
        {
            icon: <Network className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Distribuição de Soluções",
            description: "Conexão estratégica com as melhores soluções de terceiros do mercado."
        },
        {
            icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Operação Estruturada",
            description: "Gestão inteligente e estruturação comercial focada em escalar resultados."
        },
        {
            icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Soluções Próprias",
            description: "Desenvolvimento contínuo de tecnologias dentro do nosso ecossistema."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };

    return (
        <section id="sobre-content" className="w-full min-h-[100svh] flex flex-col relative overflow-hidden pointer-events-none scroll-mt-[100px] box-border" ref={ref}>
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.05)_0%,transparent_50%)]" />

            {/* Viewport Compensated Area */}
            <div className="w-full flex-1 flex flex-col pt-[84px] min-h-[calc(100svh-84px)] justify-center items-center">
                
                {/* sectionContentStack */}
                <div className="container mx-auto px-4 md:px-6 relative z-10 w-full flex flex-col items-center justify-center text-center">
                    
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="max-w-4xl mx-auto flex flex-col items-center mb-12 md:mb-16 w-full"
                    >
                        <motion.div variants={itemVariants}>
                            <SectionBadge icon={<Info className="w-4 h-4" />}>
                                O que é a RX Soluções
                            </SectionBadge>
                        </motion.div>
                        
                        <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-8 text-white leading-tight">
                            Transformamos conexões em <br className="hidden md:block" />
                            <span className="text-primary-500 font-extrabold drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                Crescimento Mensurável
                            </span>
                        </motion.h2>
                        
                        <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl px-2 md:px-0">
                            Somos uma <strong className="text-white font-medium">plataforma de crescimento</strong> que conecta empresas, parceiros e oportunidades em um único ecossistema, gerando receita, eficiência e escala.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full max-w-6xl mx-auto pointer-events-auto"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="h-full"
                            >
                                <div
                                    className="group px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 rounded-2xl bg-white/5 border border-white/10 h-full flex flex-col justify-start overflow-hidden transition-all duration-300 ease-out hover:border-primary-500/50 hover:bg-[#0a0a14] hover:-translate-y-1 cursor-default shadow-sm hover:shadow-[0_10px_30px_rgba(139,92,246,0.1)]"
                                >
                                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-[10px] bg-primary-900/40 border border-primary-500/30 flex items-center justify-center mb-3 md:mb-5 text-primary-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:text-primary-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 transition-colors duration-300 group-hover:text-primary-400">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
