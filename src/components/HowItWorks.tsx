import React, { forwardRef, useRef, useEffect, useCallback } from 'react';
import { Workflow, CheckCircle2, ArrowRight, Settings2, BarChart3, Users } from 'lucide-react';
import SectionBadge from './ui/SectionBadge';
import { useSolutionsModal } from '../hooks/useSolutionsModal';
import gsap from 'gsap';

const step1Items = ['Diagnóstico do momento da empresa', 'Mapeamento de gargalos e oportunidades', 'Clareza para priorizar próximos passos', 'Direcionamento estratégico com mais segurança'];
const step2Items = ['Conexão com parceiros estratégicos', 'Ampliação de oportunidades de negócio', 'Atuação integrada ao ecossistema RX', 'Mais aderência entre necessidade e solução'];
const step3Items = ['Estrutura comercial e operacional', 'Distribuição estratégica de soluções', 'Inteligência para ganho de eficiência', 'Crescimento com mais consistência'];

interface HorizontalCardProps {
    step: string;
    title: string;
    desc: string;
    items: string[];
    visual: React.ElementType;
    ctaHref?: string;
    ctaTarget?: string;
    ctaText?: string;
    onCtaClick?: () => void;
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ step, title, desc, items, visual: Visual, ctaHref, ctaTarget, ctaText, onCtaClick }) => {
    return (
        <div className="w-[88vw] sm:w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0 snap-center flex flex-col justify-center px-3 sm:px-4 md:px-6 relative group perspective-1000 py-4 sm:py-8">
            {/* Card Background Core & Content Wrapper */}
            <div className="relative w-full h-full min-h-[440px] sm:min-h-[480px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 ease-out group-hover:border-primary-500/50 group-hover:bg-[#0a0a14] group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] flex flex-col p-6 md:p-10">
                {/* Glow Follower Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Header: Step Number & Icon */}
                <div className="flex items-center justify-between w-full mb-6 relative z-10">
                    <div className="inline-flex items-center gap-4">
                        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-900/40 border border-primary-500/30 text-lg font-bold text-primary-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                            {step}
                        </span>
                        <span className="text-sm font-semibold text-primary-400/80 tracking-[0.2em] uppercase">
                            Passo {step}
                        </span>
                    </div>
                    <Visual className="w-10 h-10 text-gray-700 group-hover:text-primary-400/80 transition-colors duration-500" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-primary-300 relative z-10">
                    {title}
                </h3>
                
                <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-6 max-w-sm transition-colors duration-300 group-hover:text-gray-300 relative z-10">
                    {desc}
                </p>

                <div className="mt-auto w-full relative z-10">
                    <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent mb-5" />
                    <ul className="grid gap-2.5 mb-8">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm md:text-base text-gray-400 font-light transition-colors duration-300 group-hover:text-gray-300">
                                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    {ctaText && (onCtaClick || ctaHref) && (
                        onCtaClick ? (
                            <button
                                onClick={onCtaClick}
                                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group/btn cursor-pointer"
                            >
                                {ctaText}
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <a
                                href={ctaHref}
                                target={ctaTarget}
                                onClick={(e) => {
                                    if (ctaHref!.startsWith('#')) {
                                        e.preventDefault();
                                        document.querySelector(ctaHref!)?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group/btn"
                            >
                                {ctaText}
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

// Forwarding ref to access the horizontal track div from the parent Transition orchestrator
const HowItWorks = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((_props, ref) => {
    const { openModal: openSolutionsModal } = useSolutionsModal();
    const bumpedRef = useRef(false);
    
    // Internal ref to access DOM properties while still supporting standard React forwarded ref API
    const internalRef = useRef<HTMLDivElement>(null);
    const setRefs = useCallback((node: HTMLDivElement) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement>).current = node;
        }
    }, [ref]);

    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;
        
        const interval = setInterval(() => {
            const el = internalRef.current;
            if (!el) return;

            // Se o scroll estiver no início (< 50px de margem), puxamos sutilmente a trilha toda
            if (el.scrollLeft < 50) {
                gsap.to(el, {
                    x: -25,
                    duration: 0.25,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (window.innerWidth >= 768) return; // Só roda no mobile
        
        const el = e.currentTarget;
        // Pega se chegou no fim com uma tolerância de 20px
        const isEnd = (el.scrollLeft + el.clientWidth) >= (el.scrollWidth - 20);
        
        if (isEnd && !bumpedRef.current) {
            bumpedRef.current = true;
            // Força um pequeno scroll vertical nativo para revelar sutilmente a próxima seção
            window.scrollBy({ top: 120, behavior: 'smooth' });
        } else if (!isEnd) {
            bumpedRef.current = false;
        }
    };

    return (
        <section id="como-funciona" className="relative w-full h-full pointer-events-none flex items-center bg-transparent pt-16 md:pt-20">
            
            {/* The Container that stays on screen */}
            <div className="overflow-hidden w-full h-full flex items-center relative">
                
                {/* The Horizontal Track (forwarded ref for GSAP to animate) */}
                <div 
                    ref={setRefs} 
                    onScroll={handleScroll}
                    className="flex items-stretch gap-4 md:gap-8 pl-4 sm:pl-8 md:pl-24 lg:pl-32 pr-4 sm:pr-8 md:pr-24 lg:pr-32 will-change-transform w-full md:w-max overflow-x-auto snap-x snap-mandatory md:overflow-visible md:snap-none pointer-events-auto"
                    style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    
                    {/* Panel 1: Intro Narrativa */}
                    <div className="w-[85vw] sm:w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0 snap-center flex flex-col justify-center items-start px-2 sm:px-4 pl-4 sm:pl-0">
                        <SectionBadge icon={<Settings2 className="w-4 h-4" />} className="mb-4 md:mb-6">
                            Na prática
                        </SectionBadge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-white leading-tight">
                            Como funciona o <br/>
                            <span className="text-white">
                                Ecossistema.
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-lg mb-8">
                            A RX Soluções não é apenas um catálogo de produtos. Nosso ecossistema combina diagnóstico, parceiros estratégicos e operação comercial para conectar cada empresa às soluções mais aderentes ao seu momento de crescimento.
                        </p>
                        <div className="mt-12 flex items-center gap-4 text-primary-400 font-medium tracking-wide">
                            <span className="animate-pulse">Continue rolando</span>
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Panel 2: Passo 1 */}
                    <HorizontalCard 
                        step="1"
                        title="RX Análises"
                        desc="Começamos pela leitura do cenário. O RX Análises é a frente de diagnóstico estratégico da RX, criada para identificar gargalos, oportunidades e prioridades antes da tomada de decisão."
                        items={step1Items}
                        visual={BarChart3}
                        ctaText="Conhecer o RX Análises"
                        ctaHref="#rx-analises"
                    />

                    {/* Panel 3: Passo 2 */}
                    <HorizontalCard 
                        step="2"
                        title="RX Partner Program"
                        desc="A partir do diagnóstico e da necessidade de cada contexto, conectamos empresas aos parceiros estratégicos do ecossistema RX, ampliando oportunidades com mais aderência e inteligência comercial."
                        items={step2Items}
                        visual={Users}
                        ctaText="Quero ser parceiro"
                        ctaHref="#partner-program"
                    />

                    {/* Panel 4: Passo 3 */}
                    <HorizontalCard 
                        step="3"
                        title="Operação e Soluções"
                        desc="Com estratégia definida e conexões ativadas, estruturamos a operação para transformar potencial em execução, recorrência e crescimento com mais consistência."
                        items={step3Items}
                        visual={Workflow}
                        ctaText="Conhecer Soluções"
                        onCtaClick={() => openSolutionsModal()}
                    />

                </div>
                
                {/* Sombras de borda para não parecer cortado abruptamente */}
                <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#040409] via-[#040409]/80 to-transparent pointer-events-none z-20" />
                <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#040409] via-[#040409]/80 to-transparent pointer-events-none z-20" />
                
            </div>
        </section>
    );
});

export default HowItWorks;
