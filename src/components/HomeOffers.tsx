import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { useNavigate } from 'react-router-dom';
import { offersData } from '../data/offersData';

const HomeOffers = () => {
    const navigate = useNavigate();
    
    // Pegar as 4 primeiras ofertas (ou as mais prioritárias)
    const homeOffers = [...offersData]
        .filter(o => o.isActive)
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 4);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Tecnologia': return 'bg-purple-950/80 text-purple-300 border-purple-700/50';
            case 'Infraestrutura': return 'bg-blue-950/80 text-blue-300 border-blue-700/50';
            case 'Gestão de Pessoas': return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
            case 'Benefícios': return 'bg-amber-950/80 text-amber-300 border-amber-700/50';
            default: return 'bg-primary-950/80 text-primary-300 border-primary-700/50';
        }
    };

    return (
        <section className="relative w-full bg-black text-white pt-8 md:pt-12 pb-16 md:pb-24 z-30 overflow-hidden">
            
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <img 
                    src="/glass-back.jpeg" 
                    alt="Background Image" 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Header da Seção */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
                    <div>
                        <SectionBadge icon={<Tag className="w-3.5 h-3.5" />}>DESTAQUES</SectionBadge>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4">
                            Ofertas do mês
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-300">
                            Descubra condições comerciais exclusivas que nossos parceiros homologados 
                            prepararam especialmente para o ecossistema RX Soluções.
                        </p>
                    </div>
                </div>

                {/* Grade de Ofertas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {homeOffers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => navigate(`/ofertas?id=${offer.id}`)}
                            className="group relative rounded-none overflow-hidden bg-black/70 backdrop-blur-md border-[3px] border-white/10 flex flex-col aspect-[4/5] hover:border-primary-500/30 transition-colors cursor-pointer"
                        >
                            {/* Imagem da Oferta */}
                            <div className="w-full h-[55%] relative overflow-hidden">
                                <img src={offer.image} alt={offer.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 left-4 z-10">
                                    <div className={`px-2 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${getCategoryColor(offer.category)}`}>
                                        {offer.category}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Conteúdo da Oferta */}
                            <div className="p-6 flex flex-col flex-grow justify-between relative z-10 -mt-[1px]">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                        {offer.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm line-clamp-3">
                                        {offer.shortDescription}
                                    </p>
                                </div>
                                
                                <div className="flex items-center text-primary-500 font-semibold text-sm mt-4">
                                    Ver condição 
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Botão Veja Mais */}
                <div className="flex justify-start">
                    <button 
                        onClick={() => navigate('/ofertas')}
                        className="group flex items-center text-gray-300 hover:text-white font-semibold transition-colors cursor-pointer"
                    >
                        VEJA MAIS OFERTAS 
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-primary-500" />
                    </button>
                </div>

                <div className="w-full h-[3px] bg-white/10 mt-24 md:mt-32"></div>

            </div>
        </section>
    );
};

export default HomeOffers;
