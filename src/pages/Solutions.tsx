import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue, useInView } from 'framer-motion';
import SectionBadge from '../components/ui/SectionBadge';
import { ArrowRight, Box, TrendingDown, Layers, BarChart3, Building2, Rocket, Search } from 'lucide-react';
import { solutionsData, type Category, type Solution } from '../data/solutionsData';
import { useContactLeadModal } from '../context/ContactLeadModalContext';

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0.2, 1]);
    return (
        <motion.span style={{ opacity }}>
            {children}{" "}
        </motion.span>
    );
};

const getIcon = (type: string) => {
    const defaultClasses = "w-5 h-5 md:w-[22px] md:h-[22px] text-primary-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]";
    switch (type) {
        case 'efficiency': return <Box className={defaultClasses} />;
        case 'cost': return <TrendingDown className={defaultClasses} />;
        case 'system': return <Layers className={defaultClasses} />;
        case 'analytics': return <BarChart3 className={defaultClasses} />;
        default: return <Box className={defaultClasses} />;
    }
};

const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const isFuzzyMatch = (query: string, target: string) => {
    const normQuery = normalize(query);
    const normTarget = normalize(target);
    if (normTarget.includes(normQuery)) return true;
    
    const queryWords = normQuery.split(/\s+/).filter(w => w.length > 0);
    const targetWords = normTarget.split(/\s+/).filter(w => w.length > 0);
    
    if (queryWords.length === 0) return true;

    const distance = (a: string, b: string) => {
        if(a.length === 0) return b.length;
        if(b.length === 0) return a.length;
        const matrix = [];
        for(let x = 0; x <= b.length; x++){ matrix[x] = [x]; }
        for(let y = 0; y <= a.length; y++){ matrix[0][y] = y; }
        for(let x = 1; x <= b.length; x++){
            for(let y = 1; y <= a.length; y++){
                if(b.charAt(x-1) === a.charAt(y-1)){
                    matrix[x][y] = matrix[x-1][y-1];
                } else {
                    matrix[x][y] = Math.min(matrix[x-1][y-1] + 1, Math.min(matrix[x][y-1] + 1, matrix[x-1][y] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    };

    return queryWords.every(qw => {
        return targetWords.some(tw => {
            if (tw.includes(qw)) return true;
            if (qw.length <= 3) return false; 
            
            const maxDistance = qw.length > 5 ? 2 : 1;
            const twPrefix = tw.substring(0, qw.length + 1);
            return distance(qw, twPrefix) <= maxDistance || distance(qw, tw) <= maxDistance;
        });
    });
};

const SegmentHeaderDescription = ({ description }: { description: string }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 75%", "center center"]
    });

    const words = description.split(" ");

    return (
        <div ref={sectionRef}>
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
    );
};

const CategoryRow = ({ category, isOpen, onToggle }: { category: Category, isOpen: boolean, onToggle: () => void }) => {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchQuery("");
        }
    }, [isOpen]);

    const filteredSolutions = category.solutions?.filter((sol: Solution) => {
        if (!searchQuery) return true;
        const target = `${sol.name} ${sol.partnerName} ${sol.description}`;
        return isFuzzyMatch(searchQuery, target);
    }) || [];

    if (category.id === "rx-analises") {
        return (
            <div className="w-full border-[3px] border-white/10 rounded-none bg-black group/row hover:bg-white/[0.02] transition-colors mb-4 mt-8">
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-10">
                    <div className="flex flex-col mb-6 md:mb-0">
                        <div className="flex items-center gap-4 md:gap-6 mb-2">
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/row:border-primary-500/50 group-hover/row:bg-primary-900/20 transition-all duration-300 shrink-0">
                                {getIcon(category.iconType)}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white transition-colors duration-300">
                                {category.name}
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base font-light md:ml-16 max-w-xl">
                            Diagnósticos e insights para identificar gargalos e oportunidades de melhoria no seu negócio.
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 md:px-6 py-3 rounded-full font-bold transition-all shrink-0 cursor-pointer mt-5 md:mt-0 md:self-center text-sm md:text-base w-max whitespace-nowrap">
                        Entender Diagnóstico <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b-[3px] border-white/10 group/row">
            <div
                onClick={onToggle}
                className="w-full flex flex-col py-6 md:py-8 cursor-pointer group text-left outline-none bg-transparent border-none"
            >
                {/* Main Row: Icon, Title, Desktop Search, and Plus Icon */}
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-6 shrink-0">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-900/20 transition-all duration-300 shrink-0">
                            {getIcon(category.iconType)}
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-white group-hover:text-primary-400 transition-colors duration-300">
                            {category.name}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-4 ml-auto">
                        {/* Search on Desktop */}
                        <div className="hidden md:block">
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ maxWidth: 0, opacity: 0 }}
                                        animate={{ maxWidth: 400, opacity: 1 }}
                                        exit={{ maxWidth: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="overflow-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="relative w-[300px] flex items-center">
                                            <input 
                                                type="text" 
                                                placeholder={`Buscar...`}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-black border-[3px] border-white/10 text-white px-5 py-3 text-sm rounded-none outline-none focus:border-primary-500/50 transition-colors placeholder:text-gray-600 font-medium"
                                            />
                                            <Search className="w-5 h-5 text-gray-500 absolute right-5" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:border-primary-500/50 group-hover:bg-primary-900/20 ${isOpen ? 'rotate-45 bg-primary-900/20 border-primary-500/50 text-primary-400' : 'text-white/70 group-hover:text-primary-400'}`}>
                            <span className="text-2xl font-light leading-none">+</span>
                        </div>
                    </div>
                </div>

                {/* Search on Mobile */}
                <div className="block md:hidden w-full">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="pt-5">
                                    <div className="relative w-full flex items-center">
                                        <input 
                                            type="text" 
                                            placeholder={`Buscar...`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-black border-[3px] border-white/10 text-white px-4 py-3 text-sm rounded-none outline-none focus:border-primary-500/50 transition-colors placeholder:text-gray-600 font-medium"
                                        />
                                        <Search className="w-4 h-4 text-gray-500 absolute right-4" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                    >
                        {filteredSolutions.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l-[3px] border-t-[3px] border-white/10 mb-8 mt-4 bg-white/[0.01]">
                                {filteredSolutions.map((sol: Solution) => (
                                    <div key={sol.id} className="p-5 md:p-6 border-r-[3px] border-b-[3px] border-white/10 hover:bg-white/[0.03] transition-all group/item flex flex-col h-full cursor-pointer relative overflow-hidden">
                                        
                                        {/* Top Hover Border */}
                                        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-600 to-primary-400 transform scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left duration-500 z-10"></div>
                                        
                                        <div className="flex flex-col mb-5 relative z-10">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-300">{sol.partnerName}</span>
                                            </div>
                                            <h4 className="text-lg md:text-xl font-bold transition-colors text-white group-hover/item:text-primary-100 leading-tight">
                                                {sol.name}
                                            </h4>
                                        </div>
                                        
                                        <p className="text-sm text-slate-400 line-clamp-3 font-light leading-relaxed mb-6 relative z-10">
                                            {sol.description}
                                        </p>
                                        
                                        <div className="mt-auto relative z-10 flex items-center justify-between">
                                            <span className="text-white font-bold text-[11px] uppercase tracking-wider transition-all opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0">
                                                Ver Solução
                                            </span>
                                            <div className="w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 bg-white/5 opacity-100 translate-x-0 md:opacity-0 md:-translate-x-4 md:group-hover/item:opacity-100 md:group-hover/item:translate-x-0 group-hover/item:bg-primary-500/20 group-hover/item:border-primary-500/50">
                                                <ArrowRight className="w-3.5 h-3.5 text-white group-hover/item:text-primary-400" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center border-[3px] border-white/10 border-dashed mb-8 mt-4 bg-white/[0.01]">
                                <p className="text-gray-400 font-medium">Nenhuma solução encontrada para "{searchQuery}"</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SolutionsAccordion = ({ categories, expandedCategory, setExpandedCategory }: { categories: Category[], expandedCategory: string | null, setExpandedCategory: (id: string | null) => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const hasAutoExpanded = useRef(false);
    const isInView = useInView(ref, { once: true, margin: "-150px" });

    useEffect(() => {
        if (isInView && categories.length > 0 && !expandedCategory && !hasAutoExpanded.current) {
            hasAutoExpanded.current = true;
            // Pequeno delay para efeito visual depois do scroll
            setTimeout(() => {
                setExpandedCategory(categories[0].id);
            }, 300);
        }
    }, [isInView, categories, expandedCategory, setExpandedCategory]);

    return (
        <div ref={ref} className="w-full flex flex-col mb-12">
            <div className="border-t-[3px] border-white/10">
                {categories.map((category: Category) => (
                    <CategoryRow 
                        key={category.id} 
                        category={category} 
                        isOpen={expandedCategory === category.id}
                        onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const Solutions = () => {
    const { openContactModal } = useContactLeadModal();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Read segment from URL or fallback to the first one
    const segmentParam = searchParams.get('segmento');
    
    // Derive state entirely from URL param
    const activeSegmentId = (segmentParam && solutionsData.some(s => s.id === segmentParam)) 
        ? segmentParam 
        : solutionsData[0].id;
        
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    const activeData = solutionsData.find(s => s.id === activeSegmentId) || solutionsData[0];

    // Get portal target
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPortalTarget(document.getElementById('header-breadcrumb-portal'));
    }, []);

    const handleSegmentChange = (id: string) => {
        setSearchParams({ segmento: id }, { replace: true });
    };

    const heroBadgeIcon = (
        <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
        </span>
    );

    return (
        <div className="w-full min-h-screen bg-black text-white pt-32 pb-24 font-sans relative">
            
            {/* Video Background */}
            <div className="absolute top-0 left-0 right-0 w-full h-[50vh] md:h-[60vh] z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent z-10"></div>
                <video 
                    key="/background/bg-parceiro.mp4"
                    src="/background/bg-parceiro.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70"
                />
            </div>

            {/* PORTAL FOR BREADCRUMBS IN HEADER */}
            {portalTarget && createPortal(
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex items-center justify-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 md:px-2.5 md:py-1.5 border border-white/5 rounded-sm">
                        Soluções
                    </div>
                    <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary-500/60 shrink-0" />
                    <div className={`flex items-center justify-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 md:px-2.5 md:py-1.5 border rounded-sm transition-colors ${!expandedCategory ? "text-white bg-white/10 border-white/10 shadow-sm" : "text-gray-500 bg-white/5 border-white/5"}`}>
                        {activeData.label}
                    </div>
                    {expandedCategory && (
                        <>
                            <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary-500/60 shrink-0" />
                            <div className="flex items-center justify-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 px-2 py-1 md:px-2.5 md:py-1.5 border border-white/10 rounded-sm shadow-sm">
                                {activeData.categories.find((c: Category) => c.id === expandedCategory)?.name || expandedCategory}
                            </div>
                        </>
                    )}
                </div>,
                portalTarget
            )}

            {/* HERO SOLUÇÕES */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex"
                    >
                        <SectionBadge 
                            autoStart={true}
                            icon={heroBadgeIcon}
                            className="shadow-[0_0_20px_rgba(139,92,246,0.1)] inline-flex mb-2"
                        >
                            ECOSSISTEMA COMPLETO
                        </SectionBadge>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-5xl lg:text-[4rem] font-bold tracking-tighter leading-[1.15] md:leading-[1.1] mt-6 mb-8 max-w-4xl"
                    >
                        Explore o portfólio de <br className="hidden md:block" />
                        <span className="text-white">soluções por setor</span>
                    </motion.h1>
                </div>

                {/* SEGMENT SELECTOR (TABS) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full flex justify-center mt-8 pb-4 md:pb-0"
                >
                    <div className="grid grid-cols-2 md:flex w-full md:w-auto border-[3px] border-white/10 bg-white/[0.02]">
                        {solutionsData.map((seg, idx) => {
                            const isActive = activeSegmentId === seg.id;
                            
                            // Define bordas baseadas no índice para formar o grid perfeito no mobile e flex no desktop
                            let borderClasses = "";
                            if (idx === 0) borderClasses = "border-b-[3px] border-r-[3px] md:border-b-0 border-white/10";
                            else if (idx === 1) borderClasses = "border-b-[3px] md:border-r-[3px] md:border-b-0 border-white/10";
                            else if (idx === 2) borderClasses = "border-r-[3px] md:border-r-[3px] border-white/10";
                            else borderClasses = "";

                            return (
                                <button
                                    key={seg.id}
                                    onClick={() => handleSegmentChange(seg.id)}
                                    className={`
                                        px-2 py-4 sm:px-8 font-medium text-xs sm:text-sm md:text-base transition-all duration-500 w-full md:w-auto text-center cursor-pointer
                                        ${borderClasses}
                                        ${isActive 
                                            ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white backdrop-blur-md'
                                        }
                                    `}
                                >
                                    <span className="relative z-10">{seg.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* CONTENT AREA FOR ACTIVE SEGMENT */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 min-h-[600px] relative z-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSegmentId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        {/* Segment Header Presentation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center pt-2 pb-12 md:pt-10 md:pb-20 mb-8 md:mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-2xl md:text-[40px] font-semibold leading-tight whitespace-pre-line text-balance max-w-xl md:max-w-none">
                                    {activeData.impactPhrase}
                                </h2>
                            </motion.div>
                            
                            <SegmentHeaderDescription description={activeData.description} />
                        </div>

                        {/* Solutions List - Accordion Style */}
                        <SolutionsAccordion 
                            categories={activeData.categories} 
                            expandedCategory={expandedCategory}
                            setExpandedCategory={setExpandedCategory}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* PARTNERS STRIP */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12">
                <div className="py-16">
                    <div className="text-center mb-10">
                        <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                            Parceiros homologados para o setor {activeData.label}
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70">
                        {activeData.partners.map((partner) => (
                            <div key={partner.id} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer hover:scale-105">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                </div>
                                <span className="font-bold text-xl md:text-2xl text-white tracking-tight">{partner.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FINAL CTA SECTION - matching Home gradients */}
            <section className="pt-32 pb-12 relative overflow-visible bg-black z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] max-w-[800px] h-[600px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto rounded-none bg-white/[0.03] border-[3px] border-white/10 p-10 md:p-20 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(139,92,246,0.05)] relative overflow-hidden">
                        
                        <SectionBadge icon={<Rocket className="w-4 h-4" />} className="mx-auto inline-flex justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                            Não encontrou o que procurava?
                        </SectionBadge>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] mb-6 text-white mt-6">
                            Podemos encontrar a <span className="text-white">solução ideal.</span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Fale com nossos especialistas ou solicite um diagnóstico completo da <strong className="text-white font-medium">RX Análises</strong> para descobrir os gargalos e oportunidades da sua operação.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                            <button
                                onClick={() => openContactModal({
                                    redirectUrl: 'https://wa.me/5521998689659?text=Ol%C3%A1%21%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20RX.',
                                    prefilledData: {
                                        type: 'Solução',
                                        segment: activeData.label,
                                    }
                                })}
                                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 font-bold text-white text-base transition-all duration-500 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:-translate-y-1 overflow-hidden border border-white/10 hover:border-primary-300/50 cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-primary-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                                    Falar com nossa equipe
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                            </button>

                            <button
                                onClick={() => {}} // Futura rota ou modal rx-analises
                                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 font-semibold text-white text-base transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden backdrop-blur-md cursor-pointer"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Conhecer a RX Análises
                                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Solutions;

