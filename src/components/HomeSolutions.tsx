import { motion } from 'framer-motion';
import { ChevronRight, Lightbulb } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import PartnersCarousel from './PartnersCarousel';
import { useNavigate } from 'react-router-dom';

const HomeSolutions = () => {
    const navigate = useNavigate();
    const segments = [
        { name: "Segmento Farmacêutico", path: "/solucoes?segmento=farmaceutico" },
        { name: "Segmento Pet e Vet", path: "/solucoes?segmento=pet-vet" },
        { name: "Segmento de Alimentação", path: "/solucoes?segmento=alimentacao" },
        { name: "Outros Segmentos", path: "/solucoes?segmento=outros" }
    ];

    return (
        <section className="relative w-full bg-black text-white pt-8 md:pt-12 pb-12 md:pb-16 z-30">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    
                    {/* Lado Esquerdo: Títulos e Textos */}
                    <div className="max-w-xl">
                        <SectionBadge icon={<Lightbulb className="w-3.5 h-3.5" />}>SOLUÇÕES</SectionBadge>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
                            Nosso portfólio completo
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Nossas soluções são organizadas para atender as necessidades específicas do seu nicho de atuação.
                            Encontre ferramentas, parceiros e estratégias homologadas para alavancar os seus resultados em menos tempo.
                        </p>
                    </div>

                    {/* Lado Direito: Botões de Segmento (Estilo Linhas) */}
                    <div className="w-full border-t-[3px] border-white/10 mt-8 lg:mt-0">
                        {segments.map((segment, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="border-b-[3px] border-white/10"
                            >
                                <button
                                    onClick={() => navigate(segment.path)}
                                    className="w-full flex items-center justify-between py-6 md:py-8 cursor-pointer group text-left"
                                >
                                    <span className="text-2xl md:text-3xl font-medium tracking-tight text-white group-hover:text-primary-400 transition-colors duration-300">
                                        {segment.name}
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 ml-6 transition-all duration-500 group-hover:border-primary-500/50 group-hover:bg-primary-900/20">
                                        <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-primary-400" />
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </div>

                </div>

            </div>

            {/* Carrossel de Logos */}
            <div className="w-full relative mt-20 md:mt-24">
                <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
                <PartnersCarousel />
            </div>

        </section>
    );
};

export default HomeSolutions;
