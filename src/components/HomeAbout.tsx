import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Plus, X, ArrowDown, ArrowUp } from 'lucide-react';

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0.2, 1]);
    return (
        <motion.span style={{ opacity }}>
            {children}{" "}
        </motion.span>
    );
};

const newCards = [
    {
        title: "Visão Sistêmica",
        description: "Compreendemos o seu negócio de ponta a ponta, integrando diferentes áreas para criar estratégias que funcionam na prática.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-[22px] md:h-[22px] text-primary-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]">
                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path>
                <path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"></path>
                <path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"></path>
            </svg>
        )
    },
    {
        title: "Crescimento Escalável",
        description: "Focamos em resultados duradouros, construindo bases sólidas para que sua empresa escale de forma segura e contínua.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-[22px] md:h-[22px] text-primary-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
        )
    },
    {
        title: "Conexões de Valor",
        description: "Encurtamos caminhos ao conectar sua operação a um ecossistema exclusivo de soluções validadas pelo mercado.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-[22px] md:h-[22px] text-primary-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]">
                <circle cx="12" cy="5" r="3"></circle>
                <circle cx="5" cy="19" r="3"></circle>
                <circle cx="19" cy="19" r="3"></circle>
                <line x1="12" y1="8" x2="5" y2="16"></line>
                <line x1="12" y1="8" x2="19" y2="16"></line>
            </svg>
        )
    }
];

const accordionData = [
    {
        title: "RX Análises",
        text: "Inteligência estratégica baseada em dados reais do seu negócio. Avaliamos cenários, identificamos oportunidades e entregamos diagnósticos precisos para decisões mais seguras.",
        tags: ["Diagnóstico Estratégico", "Análise de Dados", "Inteligência de Mercado", "Relatórios Personalizados"]
    },
    {
        title: "Partner Program",
        text: "Rede curada de parceiros especializados em tecnologia, marketing, jurídico e gestão. Conectamos sua empresa aos melhores fornecedores com curadoria e acompanhamento.",
        tags: ["Curadoria de Parceiros", "Tecnologia", "Marketing Digital", "Gestão e Jurídico"]
    },
    {
        title: "Operação e Soluções",
        text: "Acompanhamento completo da operação comercial, do planejamento à execução. Garantimos que as estratégias saiam do papel e gerem resultados mensuráveis.",
        tags: ["Operação Comercial", "Planejamento Estratégico", "Acompanhamento de Resultados", "Crescimento Escalável"]
    }
];

const HomeAbout = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 75%", "center center"]
    });

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [hasAutoExpanded, setHasAutoExpanded] = useState(false);
    
    const accordionRef = useRef<HTMLDivElement>(null);
    const isAccordionInView = useInView(accordionRef, { once: true, margin: "-30% 0px" });

    useEffect(() => {
        if (isAccordionInView && !hasAutoExpanded) {
            if (openIndex === null) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setOpenIndex(0);
            }
            setHasAutoExpanded(true);
        }
    }, [isAccordionInView, hasAutoExpanded, openIndex]);

    const textToReveal = "Mais do que indicar fornecedores, atuamos como um parceiro estratégico. Nosso papel é entender o seu momento e apresentar as soluções que trarão o maior impacto e retorno financeiro para a sua operação.";
    const words = textToReveal.split(" ");

    return (
        <section className="relative w-full bg-black text-white pt-2 pb-16 md:pt-10 md:pb-20 z-30">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                
                {/* 1.3 Quebra de seção institucional */}
                <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center pt-4 pb-8 mb-8 lg:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Tag no Mobile */}
                        <div className="flex md:hidden flex-row flex-wrap items-center gap-2 mb-3 mt-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                                <ArrowDown className="w-3.5 h-3.5 text-red-400" />
                                Menos complexidade
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                                <ArrowUp className="w-3.5 h-3.5 text-green-400" />
                                Mais resultados reais
                            </span>
                        </div>
                        {/* Título normal no Desktop */}
                        <h2 className="hidden md:block text-3xl md:text-[40px] font-semibold leading-tight">
                            Menos complexidade. <br />
                            Mais resultados reais.
                        </h2>
                    </motion.div>
                    
                    <div>
                        <p className="text-white text-lg md:text-xl leading-relaxed font-normal">
                            {words.map((word, i) => {
                                const start = i / words.length;
                                const end = start + (1 / words.length);
                                return (
                                    <Word key={i} progress={scrollYProgress} range={[start, end]}>
                                        {word}
                                    </Word>
                                );
                            })}
                        </p>
                    </div>
                </div>

                {/* 1.4 Cards (Nenhum título, entram direto) */}
                <div className="w-full relative z-10 pb-16 lg:pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t-[3px] md:border-y-[3px] border-white/10 md:divide-x-[3px] md:divide-y-0 divide-y-[3px] divide-white/10 border-x-0 md:border-x-[3px]">
                        {newCards.map((card, idx) => (
                            <div key={idx} className="group relative py-8 px-0 md:p-10 lg:p-14 flex flex-col items-start bg-transparent hover:bg-white/[0.02] transition-colors duration-500 cursor-pointer">
                                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 mb-5 md:mb-0 w-full">
                                    <div className="w-10 h-10 md:w-12 md:h-12 md:mb-10 lg:mb-12 rounded-lg bg-primary-900/20 border border-primary-500/30 flex shrink-0 items-center justify-center group-hover:border-primary-400 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all duration-500">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-semibold text-white md:mb-4 tracking-tight leading-tight whitespace-nowrap md:whitespace-normal">
                                        {card.title}
                                    </h3>
                                </div>
                                <p className="text-[14.5px] md:text-base text-slate-400 font-light leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 1.5 Accordion */}
                <div className="w-full relative z-10 pt-0" ref={accordionRef}>
                    <div className="border-t-[3px] border-white/10">
                        {accordionData.map((item, idx) => {
                            const isOpen = openIndex === idx;
                            return (
                                <div key={idx} className="border-b-[3px] border-white/10">
                                    <button 
                                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between py-8 md:py-10 cursor-pointer group text-left"
                                    >
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight transition-colors duration-300 text-white group-hover:text-primary-400">
                                            {item.title}
                                        </h3>
                                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ml-6 transition-all duration-500 ${isOpen ? 'border-primary-500/50 bg-primary-900/20' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {isOpen ? (
                                                <X className="w-4 h-4 text-primary-400" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-white/70" />
                                            )}
                                        </div>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-10 pt-2 pr-4 md:pr-12">
                                                    <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light mb-8 max-w-3xl">
                                                        {item.text}
                                                    </p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {item.tags.map((tag, tIdx) => (
                                                            <span key={tIdx} className="px-5 py-2.5 rounded-full border border-primary-500/20 bg-primary-900/10 text-primary-300 text-sm font-medium">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HomeAbout;
