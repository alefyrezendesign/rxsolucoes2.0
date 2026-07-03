import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Building2, Handshake, Briefcase, Expand, ArrowRight, Users } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { useSolutionsModal } from '../hooks/useSolutionsModal';

function VideoBackground({ src, isActive }: { src: string; isActive: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        if (isActive) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

    return (
        <video 
            ref={videoRef}
            src={src}
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 grayscale`}
        />
    );
}

const Audience = () => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState(0);
    const { openModal } = useSolutionsModal();



    const profiles = [
        {
            icon: <Building2 className="w-5 h-5 text-primary-400" />,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
            video: "/videos-para-quem/01.mp4",
            title: "Empresas que querem crescer com estratégia",
            shortTitle: "Crescimento estratégico",
            description: "Para negócios que buscam soluções validadas para ganho de performance e eficiência operacional."
        },
        {
            icon: <Handshake className="w-5 h-5 text-primary-400" />,
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
            video: "/videos-para-quem/02.mp4",
            title: "Parceiros que querem gerar receita recorrente",
            shortTitle: "Receita recorrente",
            description: "Para quem tem uma base de clientes e quer monetizá-la indicando ou distribuindo as soluções do nosso hub."
        },
        {
            icon: <Briefcase className="w-5 h-5 text-primary-400" />,
            image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200",
            video: "/videos-para-quem/03.mp4",
            title: "Negócios que precisam de estrutura comercial",
            shortTitle: "Estrutura comercial",
            description: "Para empresas que possuem um bom produto, mas necessitam de inteligência de vendas e execução terceirizada."
        },
        {
            icon: <Expand className="w-5 h-5 text-primary-400" />,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
            video: "/videos-para-quem/04.mp4",
            title: "Empresas que querem escalar sem aumentar equipe",
            shortTitle: "Escala eficiente",
            description: "Terceirização estratégica da operação de vendas e estruturação de novos canais de receita."
        }
    ];

    return (
        <section id="para-quem" className="pt-8 md:pt-12 pb-6 md:pb-8 flex flex-col relative z-20" ref={ref}>
            
            {/* The absolute video background was moved to the bottom */}

            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center mb-6 md:mb-12"
                >
                    <SectionBadge icon={<Users className="w-4 h-4" />}>
                        PARA QUEM É?
                    </SectionBadge>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight mt-4">
                        Para quem deseja:
                    </h2>
                </motion.div>

                {/* Expanding Image Accordion */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col md:flex-row border-[3px] border-white/10 divide-y-[3px] md:divide-y-0 md:divide-x-[3px] divide-white/10 min-h-[480px] sm:min-h-[600px] h-[65svh] md:min-h-0 md:h-[440px] lg:h-[480px] w-full mx-auto overflow-hidden bg-black"
                >
                    {profiles.map((profile, i) => {
                        const isActive = activeIndex === i;
                        return (
                            <motion.div
                                key={i}
                                layout
                                onClick={() => setActiveIndex(i)}
                                className={`relative overflow-hidden cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                                    isActive ? 'flex-[4_4_0%]' : 'flex-[0_auto] basis-[80px] sm:basis-[100px] md:basis-auto md:flex-[1_1_0%] hover:bg-white/[0.02]'
                                }`}
                                style={!isActive ? { minHeight: '80px' } : {}}
                            >
                                {/* Background Media Wrapper */}
                                <div className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-500 ${isActive ? 'bg-black' : 'bg-black'}`}>
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                exit={{ opacity: 0 }} 
                                                transition={{ duration: 0.5 }} 
                                                className="absolute inset-0 w-full h-full"
                                            >
                                                {profile.video ? (
                                                    <VideoBackground src={profile.video} isActive={isActive} />
                                                ) : (
                                                    <img 
                                                        src={profile.image} 
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-[1.01] overflow-hidden grayscale"
                                                        alt={profile.title}
                                                    />
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                {/* Gradient Overlay (Only over media) */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" 
                                        />
                                    )}
                                </AnimatePresence>
                                
                                {/* Inactive State Content (Premium Dark Glass Look Mobile vs Desktop) */}
                                <AnimatePresence>
                                    {!isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.4 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                            className="absolute inset-0 flex flex-row md:flex-col items-center justify-start px-6 md:justify-center md:p-6 transition-colors duration-700 pointer-events-none"
                                        >
                                            <div className="relative z-10 p-3 md:p-5 rounded-xl md:rounded-2xl bg-primary-900/20 border border-primary-500/30 shrink-0 mr-4 mb-0 md:mr-0 md:mb-6 inline-flex transition-all duration-500 group-hover:border-primary-400 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]">
                                                {profile.icon}
                                            </div>
                                            
                                            <h3 className="relative z-10 text-white font-bold text-base md:text-lg tracking-wide md:tracking-wider text-left md:text-center transition-colors duration-300 drop-shadow-md">
                                                {profile.shortTitle}
                                            </h3>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Active State Content (Bottom aligned text, vertically centered icon) */}
                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                            className="absolute inset-0 p-5 md:p-8 flex flex-col z-10"
                                        >
                                            {/* Desktop Icon Wrapper (mimics minimized vertical alignment) */}
                                            <div className="hidden md:flex absolute inset-0 p-8 flex-col items-start justify-center pointer-events-none">
                                                <div className="p-5 rounded-2xl bg-primary-900/30 backdrop-blur-md border border-primary-500/50 shadow-[0_0_20px_rgba(167,139,250,0.3)] shrink-0 pointer-events-auto mb-6">
                                                    {profile.icon}
                                                </div>
                                                {/* Invisible ghost text to push the icon up exactly like the minimized cards do */}
                                                <h3 className="opacity-0 font-bold text-lg tracking-wider pointer-events-none">
                                                    {profile.shortTitle}
                                                </h3>
                                            </div>

                                            {/* Mobile Icon (keeps normal flow) */}
                                            <div className="md:hidden flex items-start w-full mb-4">
                                                <div className="p-3 rounded-xl bg-primary-900/30 backdrop-blur-md border border-primary-500/50 shadow-[0_0_20px_rgba(167,139,250,0.3)] shrink-0">
                                                    {profile.icon}
                                                </div>
                                            </div>

                                            {/* Text Content (pushed to bottom) */}
                                            <div className="flex-1 w-full relative flex flex-col justify-end pointer-events-auto">
                                                <h3 className="font-bold text-white text-xl md:text-3xl leading-tight mb-3 text-balance max-w-2xl">
                                                    {profile.title}
                                                </h3>
                                                <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed hidden sm:block text-balance max-w-2xl">
                                                    {profile.description}
                                                </p>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal(profile.title);
                                                    }}
                                                    className="mt-4 md:mt-5 inline-flex items-center gap-2 text-primary-400 font-medium text-sm md:text-base hover:text-primary-300 transition-colors w-fit cursor-pointer outline-none border-none bg-transparent"
                                                >
                                                    Saber mais <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

        </section>
    );
};

export default Audience;
