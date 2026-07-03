import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const heroBadgeIcon = (
        <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
        </span>
    );

    const words = [
        { text: "Conectamos", brAfter: false },
        { text: "você", brAfter: true },
        { text: "às", brAfter: false },
        { text: "melhores", brAfter: false },
        { text: "soluções", brAfter: true },
        { text: "do", brAfter: false },
        { text: "mercado", brAfter: false },
        { text: "para", brAfter: false },
        { text: "o", brAfter: true },
        { text: "seu", brAfter: false },
        { text: "negócio.", brAfter: false },
    ];

    return (
        // Alterado de min-h-screen para min-h-[85vh] para aproximar ainda mais a próxima seção
        <div ref={containerRef} className="relative w-full min-h-[85vh]">
            
            {/* Secção Hero com posicionamento normal (removido o sticky) */}
            <section className="relative w-full min-h-[85vh] overflow-hidden bg-black group flex flex-col">
                {/* Video Background */}
                <video 
                    src="/background/bkg-solucoes.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70 z-0"
                />

                {/* Overlay Escuro */}
                <div className="absolute inset-0 z-[1] bg-black/25 pointer-events-none"></div>

                {/* Fade inferior */}
                <div className="absolute bottom-0 left-0 w-full h-[50vh] md:h-[60vh] z-[2] bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative flex-1 flex flex-col justify-center items-center z-10 pt-24 pb-12">
                    <div className="relative w-full mx-auto text-center">
                        
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative inline-flex"
                        >
                            <SectionBadge 
                                autoStart={true} 
                                icon={heroBadgeIcon}
                                className="mb-6 md:mb-8 shadow-[0_0_20px_rgba(139,92,246,0.1)] inline-flex"
                            >
                                ECOSSISTEMA DE SOLUÇÕES HOMOLOGADAS
                            </SectionBadge>
                        </motion.div>

                        {/* Main Headline */}
                        <div className="mb-8 md:mb-12 flex flex-col items-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-4xl sm:text-5xl md:text-5xl lg:text-[4rem] font-bold tracking-tighter leading-[1.15] md:leading-[1.1] max-w-4xl text-center"
                            >
                                {words.map((word, i) => (
                                    <span key={i}>
                                        <motion.span 
                                            initial={{ color: '#3f3f46' }}
                                            animate={{ color: '#ffffff' }}
                                            transition={{ 
                                                duration: 0.8, 
                                                delay: 0.5 + (i * 0.1), // Animação em cascata ao carregar a página
                                                ease: "easeOut"
                                            }}
                                        >
                                            {word.text}
                                        </motion.span>
                                        {word.brAfter ? <br /> : <span> </span>}
                                    </span>
                                ))}
                            </motion.h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-sm sm:max-w-none mx-auto"
                        >
                            <button
                                onClick={() => navigate('/solucoes')}
                                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 sm:px-8 sm:py-4 font-bold text-white text-sm sm:text-lg transition-all duration-500 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-1 overflow-hidden border border-primary-500/50 hover:border-primary-400 cursor-pointer"
                            >
                                <motion.span 
                                    className="absolute inset-y-0 w-[100%] bg-gradient-to-r from-transparent via-primary-500/40 to-transparent skew-x-[-20deg]"
                                    animate={{ left: ['-150%', '150%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                />
                                <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                                    Explorar Soluções
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                            </button>

                            <button
                                onClick={() => navigate('/parceiros')}
                                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 sm:px-8 sm:py-4 font-semibold text-white text-sm sm:text-lg transition-all duration-300 bg-white/5 border border-white/25 rounded-full hover:bg-white/10 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden backdrop-blur-md cursor-pointer"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Conhecer Parceiros
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;
