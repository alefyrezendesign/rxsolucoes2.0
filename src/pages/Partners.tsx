import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, X, 
    ArrowRight, ExternalLink, MessageCircle, Zap, Check, Crown
} from 'lucide-react';
import SectionBadge from '../components/ui/SectionBadge';
import PartnerProgram from '../components/PartnerProgram';
import { partnersData, getUniqueSegments, getUniqueCategories } from '../data/partnersDirectoryData';
import { useContactLeadModal } from '../context/ContactLeadModalContext';

const CategoryDropdown = ({ categories, selected, onChange }: { categories: string[], selected: string, onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full lg:w-64 shrink-0" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/[0.03] border-[3px] py-3.5 px-4 pr-10 text-sm text-white flex items-center justify-between transition-colors rounded-none outline-none ${isOpen ? 'border-primary-500/50' : 'border-white/10 hover:border-white/20'}`}
            >
                <span className="truncate">{selected || "Todas as Categorias"}</span>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0c] border-[3px] border-white/10 z-50 rounded-none shadow-xl flex flex-col max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    >
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${!selected ? 'bg-primary-900/40 text-primary-500' : 'text-white hover:bg-primary-900/40'}`}
                        >
                            Todas as Categorias
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { onChange(cat); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-white/5 ${selected === cat ? 'bg-primary-900/40 text-primary-500' : 'text-white hover:bg-primary-900/40'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const getCategoryColor = () => {
    // Retornando cinza com texto branco para todas as categorias
    return 'text-white bg-white/5 border-white/10';
};

const Partners = () => {
    const { openContactModal } = useContactLeadModal();
    const segments = useMemo(() => getUniqueSegments(), []);
    const categories = useMemo(() => getUniqueCategories(), []);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSegment, setSelectedSegment] = useState<string>(segments.length > 0 ? segments[0] : '');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

    const heroBadgeIcon = (
        <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
        </span>
    );

    const filteredPartners = useMemo(() => {
        return partnersData
            .filter(p => p.isActive)
            .filter(p => {
                if (!searchTerm) return true;
                return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .filter(p => {
                if (!selectedSegment) return true;
                return p.segments.includes(selectedSegment);
            })
            .filter(p => {
                if (!selectedCategory) return true;
                return p.categories.includes(selectedCategory);
            })
            .sort((a, b) => b.priority - a.priority);
    }, [searchTerm, selectedSegment, selectedCategory]);

    const handlePartnerClick = (id: string) => {
        setSelectedPartnerId(prev => prev === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-0 relative">
            {/* Video Background do Hero */}
            <div className="absolute top-0 left-0 right-0 w-full h-[50vh] md:h-[60vh] z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent z-10"></div>
                <video 
                    src="/background/bg-parceiro.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70"
                />
            </div>

            {/* 1. Hero Centralizado */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-20 relative z-10">
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
                            className="shadow-[0_0_20px_rgba(139,92,246,0.1)] inline-flex"
                        >
                            REDE DE CONEXÕES
                        </SectionBadge>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tighter leading-[1.15] md:leading-[1.1] mt-6 mb-8 max-w-4xl text-center"
                    >
                        Parceiros que ampliam <br className="hidden md:block" />
                        <span className="text-white">possibilidades</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl leading-relaxed font-normal max-w-3xl"
                    >
                        O ecossistema de parceiros RX reúne empresas homologadas, prontas para atender 
                        diferentes necessidades do seu negócio com soluções integradas e confiáveis.
                    </motion.p>
                </div>
            </section>

            {/* 3. Filtros e Segmentos */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-10 relative z-20">
                
                {/* Segment Selector */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-nowrap overflow-x-auto md:overflow-visible justify-start md:justify-center mb-8 pb-4 md:pb-0 scrollbar-hide snap-x"
                >
                    <div className="flex border-[3px] border-white/10 divide-x-[3px] divide-white/10 bg-white/[0.02]">
                        {segments.map((seg) => {
                            const isActive = selectedSegment === seg;
                            return (
                                <button
                                    key={seg}
                                    onClick={() => setSelectedSegment(seg)}
                                    className={`px-6 py-3.5 sm:px-8 sm:py-4 font-medium text-sm md:text-base transition-all duration-500 shrink-0 snap-start overflow-hidden cursor-pointer ${
                                        isActive 
                                            ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white backdrop-blur-md'
                                    }`}
                                >
                                    <span className="relative z-10">{seg}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Busca Secundaria e Filtro Categoria */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-3 w-full max-w-3xl mx-auto">
                    <div className="relative w-full lg:flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text"
                            placeholder="Buscar parceiro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border-[3px] border-white/10 hover:border-white/20 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors rounded-none"
                        />
                    </div>
                    
                    {/* Category Filter */}
                    <CategoryDropdown 
                        categories={categories}
                        selected={selectedCategory}
                        onChange={setSelectedCategory}
                    />

                    {(searchTerm || selectedCategory) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                            }}
                            className="w-full lg:w-auto shrink-0 flex items-center justify-center gap-1.5 px-6 py-3.5 border-[3px] border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest rounded-none"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar
                        </button>
                    )}
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500 font-medium tracking-wide uppercase">
                    {filteredPartners.length} {filteredPartners.length === 1 ? 'parceiro encontrado' : 'parceiros encontrados'}
                </div>
            </section>

            {/* 4. Diretório (Lista) */}
            <section className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-32 relative z-10 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredPartners.length > 0 ? (
                        <div className="border-t-[3px] border-white/10 w-full">
                            {filteredPartners.map((partner) => {
                                const isExpanded = selectedPartnerId === partner.id;
                                
                                return (
                                    <div
                                        key={partner.id}
                                        className="border-b-[3px] border-white/10 group/row overflow-hidden bg-black transition-all duration-300"
                                    >
                                        {/* Cabeçalho da Linha */}
                                        <button
                                            onClick={() => handlePartnerClick(partner.id)}
                                            className="w-full flex flex-col md:flex-row items-start md:items-center justify-between py-6 md:py-8 cursor-pointer group text-left outline-none bg-transparent border-none gap-4 md:gap-0"
                                        >
                                            <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                                <div className="w-24 h-12 md:w-32 md:h-14 border border-white/20 flex items-center justify-center font-black text-white/50 shrink-0 transition-all bg-white/5 group-hover/row:border-primary-500/50 group-hover/row:bg-primary-900/20 group-hover/row:text-primary-400 text-sm md:text-base">
                                                    {partner.logo}
                                                </div>
                                                <div className="flex flex-col gap-1 md:gap-2">
                                                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white group-hover/row:text-primary-400 transition-colors duration-300">
                                                        {partner.name}
                                                    </h3>
                                                    {/* Badge de categorias e indicação visual */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-0">
                                                        {/* Categorias do Parceiro */}
                                                        {partner.categories?.map((cat, idx) => (
                                                            <div key={idx} className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 border ${getCategoryColor()}`}>
                                                                {cat}
                                                            </div>
                                                        ))}

                                                        {partner.isHighlighted && (
                                                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary-400 font-bold bg-primary-500/10 px-2 py-0.5 border border-primary-500/20">
                                                                <Crown className="w-3 h-3" />
                                                                Mais Recomendado
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botão de Expandir/Fechar */}
                                            <div className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 self-end md:self-center md:ml-6 transition-all duration-500 group-hover/row:border-primary-500/50 group-hover/row:bg-primary-900/20
                                                ${isExpanded 
                                                    ? 'bg-primary-900/20 border-primary-500/50 text-primary-400 rotate-45' 
                                                    : 'text-white/70 group-hover/row:text-primary-400'
                                                }
                                            `}>
                                                <span className="text-2xl font-light leading-none">+</span>
                                            </div>
                                        </button>

                                        {/* Vista Expandida (Conteúdo Interno) */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                                                        
                                                        {/* Coluna Esquerda: Descrições e Tags */}
                                                        <div className="flex-1 space-y-8">
                                                            {/* Tags */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {partner.segments.map(seg => (
                                                                    <span key={seg} className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                                                                        {seg}
                                                                    </span>
                                                                ))}
                                                                {partner.categories.map(cat => (
                                                                    <span key={cat} className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20">
                                                                        {cat}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Sobre */}
                                                            <div>
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sobre a empresa</h4>
                                                                <p className="text-gray-300 leading-relaxed text-sm">
                                                                    {partner.fullDescription}
                                                                </p>
                                                            </div>

                                                            {/* Diferenciais */}
                                                            {partner.differentials && partner.differentials.length > 0 && (
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Diferenciais</h4>
                                                                    <ul className="space-y-2">
                                                                        {partner.differentials.map((diff, i) => (
                                                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                                                                                {diff}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Coluna Direita: Soluções e Ações */}
                                                        <div className="w-full lg:w-[400px] shrink-0 space-y-6">
                                                            {/* Soluções */}
                                                            <div className="bg-white/[0.02] border-[3px] border-white/10 rounded-none p-6">
                                                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    Soluções Integradas
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {partner.solutions.map((sol, i) => (
                                                                        <div key={i} className="flex items-start gap-3">
                                                                            <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                                                <Check className="w-3 h-3 text-primary-400" />
                                                                            </div>
                                                                            <span className="text-sm text-gray-300 font-medium">{sol}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Ofertas */}
                                                            {partner.offers && partner.offers.length > 0 && (
                                                                <div className="bg-gradient-to-br from-primary-900/10 to-black border-[3px] border-primary-500/30 rounded-none p-6">
                                                                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                        <Zap className="w-4 h-4" />
                                                                        Ofertas Exclusivas
                                                                    </h4>
                                                                    <ul className="space-y-3">
                                                                        {partner.offers.map((offer, i) => (
                                                                            <li key={i} className="flex items-start gap-2 text-sm text-white/90 font-medium">
                                                                                <ArrowRight className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                                                                {offer}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {/* Ações */}
                                                            <div className="flex flex-row gap-3 pt-2">
                                                                {partner.website && (
                                                                    <a 
                                                                        href={partner.website}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-none bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                                                                    >
                                                                        Acessar Site
                                                                        <ExternalLink className="w-4 h-4" />
                                                                    </a>
                                                                )}
                                                                {partner.whatsapp && (
                                                                    <button 
                                                                        onClick={() => openContactModal({
                                                                            redirectUrl: `https://wa.me/${partner.whatsapp}?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20da%20p%C3%A1gina%20de%20Parceiros%20da%20RX%20Solu%C3%A7%C3%B5es.`,
                                                                            prefilledData: {
                                                                                type: 'Parceiro',
                                                                                segment: partner.segments[0] || 'Geral',
                                                                                category: partner.categories[0] || 'Outros',
                                                                                item: partner.name
                                                                            }
                                                                        })}
                                                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-none bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-bold transition-all cursor-pointer"
                                                                    >
                                                                        Falar no WhatsApp
                                                                        <MessageCircle className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center border-[3px] border-white/10 border-dashed rounded-none bg-white/[0.01]"
                        >
                            <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                <Search className="w-5 h-5 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Nenhum parceiro encontrado</h3>
                            <p className="text-gray-400 max-w-sm mx-auto mb-6 text-sm">
                                Modifique sua busca ou remova os filtros para visualizar os parceiros homologados.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSegment('');
                                    setSelectedCategory('');
                                }}
                                className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                            >
                                Limpar filtros
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* 5. Partner Program (Planos) */}
            <div className="relative z-20 bg-black pb-12">
                <PartnerProgram />
            </div>

        </div>
    );
};

export default Partners;
