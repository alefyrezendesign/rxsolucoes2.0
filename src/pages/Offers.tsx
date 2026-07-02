import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, MessageCircle, Tag, Filter, ShoppingBag } from 'lucide-react';
import { offersData, getUniqueOfferCategories, type Offer } from '../data/offersData';
import SectionBadge from '../components/ui/SectionBadge';
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
        <div className="relative w-full md:min-w-[280px]" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/[0.03] border-[3px] py-4 pl-6 pr-14 text-base text-white flex items-center justify-between transition-colors rounded-none outline-none ${isOpen ? 'border-primary-500/50' : 'border-white/10 hover:border-white/20'}`}
            >
                <span className="truncate">{selected || "Todas as Categorias"}</span>
                <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0c] border-[3px] border-white/10 z-50 rounded-none shadow-xl flex flex-col max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className={`w-full text-left px-6 py-4 text-base transition-colors ${!selected ? 'bg-primary-900/40 text-primary-500' : 'text-white hover:bg-primary-900/40'}`}
                        >
                            Todas as Categorias
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { onChange(cat); setIsOpen(false); }}
                                className={`w-full text-left px-6 py-4 text-base transition-colors border-t border-white/5 ${selected === cat ? 'bg-primary-900/40 text-primary-500' : 'text-white hover:bg-primary-900/40'}`}
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

const Offers = () => {
    const { openContactModal } = useContactLeadModal();
    const categories = useMemo(() => getUniqueOfferCategories(), []);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const location = useLocation();

    // Checar URL param ao carregar a página
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const offerId = params.get('id');
        if (offerId) {
            const found = offersData.find(o => o.id === offerId);
            if (found) {
                // Dar um pequeno delay para a página renderizar
                setTimeout(() => {
                    const gridSection = document.getElementById('offers-grid');
                    if (gridSection) {
                        // Scroll suave até a grade de ofertas
                        gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    // Abrir o modal depois que o scroll tiver tempo de ocorrer
                    setTimeout(() => {
                        setSelectedOffer(found);
                    }, 800);
                }, 100);
            }
        }
    }, [location.search]);

    // Filtragem e ordenação
    const filteredOffers = useMemo(() => {
        return offersData
            .filter(o => o.isActive)
            .filter(o => selectedCategory ? o.category === selectedCategory : true)
            .filter(o => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                return (
                    o.name.toLowerCase().includes(searchLower) ||
                    o.partnerName.toLowerCase().includes(searchLower) ||
                    o.shortDescription.toLowerCase().includes(searchLower) ||
                    o.type.toLowerCase().includes(searchLower)
                );
            })
            .sort((a, b) => {
                // Ordenação: 1º Destaque/Patrocinado, 2º Prioridade
                if (a.isHighlighted && !b.isHighlighted) return -1;
                if (!a.isHighlighted && b.isHighlighted) return 1;
                return b.priority - a.priority;
            });
    }, [selectedCategory, searchTerm]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Sistemas': return 'bg-blue-950/80 text-blue-300 border-blue-700/50';
            case 'Financeiro': return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
            case 'Consultoria': return 'bg-amber-950/80 text-amber-300 border-amber-700/50';
            case 'Marketing': return 'bg-rose-950/80 text-rose-300 border-rose-700/50';
            case 'Infraestrutura': return 'bg-purple-950/80 text-purple-300 border-purple-700/50';
            case 'Recursos humanos': return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50';
            case 'Treinamentos': return 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50';
            default: return 'bg-primary-950/80 text-primary-300 border-primary-700/50';
        }
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-24 md:pb-32 bg-black text-white relative">
            
            {/* Video Background do Hero */}
            <div className="absolute top-0 left-0 right-0 w-full h-[50vh] md:h-[60vh] z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent z-10"></div>
                <video 
                    src="/background/bkg-ofertas-hero.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70"
                />
            </div>

            {/* 1. Hero da Página */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-20 relative z-20 text-center">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex"
                    >
                        <SectionBadge 
                            autoStart={true}
                            icon={(
                                <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                            )}
                            className="shadow-[0_0_20px_rgba(139,92,246,0.1)] inline-flex mb-2"
                        >
                            CONDIÇÕES ESPECIAIS
                        </SectionBadge>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-5xl lg:text-[4rem] font-bold tracking-tighter leading-[1.15] md:leading-[1.1] mt-6 mb-8 max-w-4xl text-center"
                    >
                        Ofertas e <br className="hidden md:block" />
                        <span className="text-white">Benefícios</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl leading-relaxed font-normal max-w-3xl"
                    >
                        Explore condições comerciais exclusivas dos nossos parceiros, 
                        feitas sob medida para potencializar sua farmácia ou clínica.
                    </motion.p>
                </div>
            </section>

            {/* 2. Busca e Filtros */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-12 relative z-30">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* Campo de Busca */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/[0.03] border-[3px] border-white/10 hover:border-white/20 py-4 pl-14 pr-6 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors rounded-none"
                            />
                        </div>

                        {/* Filtro de Categoria */}
                        <CategoryDropdown 
                            categories={categories}
                            selected={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>

                    {/* Filtros Ativos e Contagem */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                        <div className="text-sm font-medium text-gray-500">
                            {filteredOffers.length === 0 ? 'Nenhuma oferta encontrada.' : `${filteredOffers.length} ${filteredOffers.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}`}
                        </div>

                        <AnimatePresence>
                            {(searchTerm || selectedCategory) && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-wrap items-center gap-2"
                                >
                                    <span className="text-xs text-gray-500 font-medium mr-2">Filtros ativos:</span>
                                    
                                    {selectedCategory && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium">
                                            <span>Categoria: {selectedCategory}</span>
                                            <button onClick={() => setSelectedCategory('')} className="hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {searchTerm && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium">
                                            <span>Busca: "{searchTerm}"</span>
                                            <button onClick={() => setSearchTerm('')} className="hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleClearFilters}
                                        className="text-xs text-gray-400 hover:text-white underline decoration-dashed underline-offset-4 ml-2 transition-colors"
                                    >
                                        Limpar
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* 3. Grade de Ofertas */}
            <section id="offers-grid" className="w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-12 relative z-20">
                {filteredOffers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
                        {filteredOffers.map((offer, index) => (
                            <motion.div
                                key={offer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                onClick={() => setSelectedOffer(offer)}
                                className="group relative flex flex-col bg-[#0a0a0c] rounded-none border-[2px] transition-all duration-300 cursor-pointer overflow-hidden border-white/10 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                            >
                                {/* Imagem Area (Product Image style) */}
                                <div className="w-full h-32 sm:h-48 relative overflow-hidden bg-[#111]">
                                    {offer.image ? (
                                        <img src={offer.image} alt={offer.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-white/20 text-3xl sm:text-4xl">
                                            {offer.partnerLogo}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
                                    
                                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                                         <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-none text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(offer.category)}`}>
                                            {offer.category}
                                        </div>
                                    </div>
                                </div>

                                {/* Detalhes do Produto */}
                                <div className="p-3 sm:p-5 flex-grow flex flex-col">
                                    <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold mb-1 sm:mb-1.5 uppercase tracking-wider truncate">{offer.partnerName}</span>
                                    <h3 className="text-sm sm:text-lg font-bold text-white leading-tight mb-1 sm:mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                                        {offer.name}
                                    </h3>
                                    
                                    <p className="hidden sm:-webkit-box sm:line-clamp-2 text-sm text-gray-400 mb-5">
                                        {offer.shortDescription}
                                    </p>

                                    {/* Botão de Ação */}
                                    <div className="mt-auto pt-2 sm:pt-0">
                                        <button className="w-full py-2 sm:py-3 rounded-none font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 text-white border border-white/10 hover:bg-primary-600 hover:border-primary-500 transition-all duration-300">
                                            <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                                            <span>Ver Oferta</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-lg mx-auto text-center py-20 bg-white/5 border-[3px] border-white/10 rounded-none"
                    >
                        <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Nenhuma oferta encontrada</h3>
                        <p className="text-gray-400 text-sm mb-6">Não localizamos resultados para os filtros que você aplicou.</p>
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2.5 rounded-none bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-colors"
                        >
                            Limpar filtros e ver tudo
                        </button>
                    </motion.div>
                )}
            </section>

            {/* Modal de Detalhes da Oferta */}
            <AnimatePresence>
                {selectedOffer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOffer(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-[#0a0a0c] border-[3px] border-white/10 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="relative p-6 sm:p-8 border-b-[3px] border-white/10 bg-white/[0.02]">
                                <button 
                                    onClick={() => setSelectedOffer(null)}
                                    className="absolute top-6 right-6 p-2 rounded-none border-[3px] border-white/10 bg-transparent hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                
                                <div className="flex items-center gap-3 mb-4 pr-12">
                                    <div className="w-12 h-10 bg-white/5 border border-white/20 flex items-center justify-center font-black text-white/50 shrink-0">
                                        <span className="text-xs">{selectedOffer.partnerLogo}</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-medium">Oferecido por</div>
                                        <div className="text-sm text-white font-semibold">{selectedOffer.partnerName}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2.5 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(selectedOffer.category)}`}>
                                        {selectedOffer.category}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium px-2 border-l-[3px] border-white/10">
                                        {selectedOffer.type}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                                    {selectedOffer.name}
                                </h2>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 sm:p-8 overflow-y-auto flex-grow custom-scrollbar">
                                <div className="space-y-8">
                                    
                                    {/* Descrição */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            Sobre a oferta
                                        </h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {selectedOffer.fullDescription}
                                        </p>
                                    </div>

                                    {/* Benefícios */}
                                    {selectedOffer.benefits && selectedOffer.benefits.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                Principais Vantagens
                                            </h4>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {selectedOffer.benefits.map((benefit, i) => (
                                                    <li key={i} className="flex items-start gap-2.5 bg-white/5 border border-white/5 rounded-none p-3">
                                                        <div className="w-5 h-5 rounded-none border border-primary-500/20 bg-primary-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <div className="w-1.5 h-1.5 rounded-none bg-primary-400" />
                                                        </div>
                                                        <span className="text-sm text-gray-300 leading-snug">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Condição */}
                                    <div className="bg-primary-900/20 border-[3px] border-primary-500/30 rounded-none p-5 relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 blur-[40px] pointer-events-none rounded-none" />
                                        <h4 className="text-sm font-semibold text-primary-400 mb-2 flex items-center gap-2">
                                            <Tag size={16} /> Condição Comercial
                                        </h4>
                                        <div className="text-lg font-bold text-white mb-2">
                                            {selectedOffer.commercialCondition}
                                        </div>
                                        {selectedOffer.validity && (
                                            <div className="text-xs text-primary-400/80 font-medium">
                                                *Válido até {new Date(selectedOffer.validity).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 sm:p-8 border-t-[3px] border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-end gap-4">
                                <button 
                                    onClick={() => setSelectedOffer(null)}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-none border-[3px] border-white/10 bg-transparent hover:bg-white/5 font-bold text-sm text-white transition-colors"
                                >
                                    Voltar
                                </button>
                                
                                {selectedOffer.linkType === 'external' && selectedOffer.externalLink ? (
                                    <a 
                                        href={selectedOffer.externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-none font-bold text-sm bg-primary-600 hover:bg-primary-500 text-white transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Acessar Oferta <ExternalLink size={16} />
                                    </a>
                                ) : (
                                    <button 
                                        onClick={() => openContactModal({
                                            redirectUrl: `https://wa.me/${selectedOffer.whatsappNumber}?text=${encodeURIComponent(selectedOffer.whatsappMessage || '')}`,
                                            prefilledData: {
                                                type: 'Oferta',
                                                category: selectedOffer.category,
                                                item: selectedOffer.name,
                                                segment: selectedOffer.type
                                            }
                                        })}
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-none font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <MessageCircle size={18} className="fill-white" /> Falar com Especialista
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
        </div>
    );
};

export default Offers;
