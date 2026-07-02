import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Shield, Layers, Compass, Lightbulb, TrendingUp, Crosshair, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBadge from './ui/SectionBadge';

gsap.registerPlugin(ScrollTrigger);

const RxAnalises = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // ── Spline preload state ──
    const splineContainerRef = useRef<HTMLDivElement>(null);
    const splineIframeRef = useRef<HTMLIFrameElement>(null);
    const [splineLoaded, setSplineLoaded] = useState(false);
    const [splineVisible, setSplineVisible] = useState(false);

    const keywords = [
        { text: "Segurança", icon: <Shield className="w-4 h-4" /> },
        { text: "Base", icon: <Layers className="w-4 h-4" /> },
        { text: "Direcionamento", icon: <Compass className="w-4 h-4" /> },
        { text: "Oportunidades", icon: <Lightbulb className="w-4 h-4" /> },
        { text: "Crescimento", icon: <TrendingUp className="w-4 h-4" /> },
        { text: "Precisão", icon: <Crosshair className="w-4 h-4" /> }
    ];

    // ── Detect mobile once ──
    const isMobile = useRef(typeof window !== 'undefined' && window.innerWidth < 768);

    // ══════════════════════════════════════════════════════════════
    // ── SPLINE: Pre-load 800px before section enters viewport ──
    // ══════════════════════════════════════════════════════════════

    // Step 1: Iframe is mounted IMMEDIATELY (hidden off-screen) so it
    // has the entire page lifetime to download & initialize the Spline runtime.
    // We listen for its 'load' event to know when it's ready.
    useEffect(() => {
        const iframe = splineIframeRef.current;
        if (!iframe) return;

        const onLoad = () => setSplineLoaded(true);
        iframe.addEventListener('load', onLoad);
        return () => iframe.removeEventListener('load', onLoad);
    }, []);

    // Step 2: When the user approaches the section, reveal the Spline.
    // If it already loaded, show immediately. If not, it will fade in
    // as soon as the load event fires.
    useEffect(() => {
        const sectionEl = ref.current;
        if (!sectionEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSplineVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px 400px 0px', threshold: 0 }
        );

        observer.observe(sectionEl);
        return () => observer.disconnect();
    }, []);

    // ══════════════════════════════════════════════════════════════
    // ── CANVAS FRAME ANIMATION (background divider) ──────────────
    // ══════════════════════════════════════════════════════════════
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameCount = 100;

    const renderFrame = useCallback((index: number) => {
        if (canvasRef.current && imagesRef.current[index]?.complete) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const wrapper = canvas.parentElement;
                if (wrapper) {
                    canvas.width = wrapper.clientWidth;
                    canvas.height = wrapper.clientHeight;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const img = imagesRef.current[index];
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        }
    }, []);

    // ── Progressive batch loading: keyframes first, then fill gaps ──
    useEffect(() => {
        const sectionEl = ref.current;
        if (!sectionEl) return;

        // Only start loading frames when approaching the section
        const frameObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadFramesProgressively();
                    frameObserver.disconnect();
                }
            },
            { rootMargin: '0px 0px 600px 0px', threshold: 0 }
        );

        frameObserver.observe(sectionEl);

        const loadFramesProgressively = async () => {
            // Pre-fill the array with nulls
            imagesRef.current = new Array(frameCount);

            // Phase 1: Load keyframes (every 10th frame) for quick scrub
            const keyframes = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99];
            await loadBatch(keyframes);

            // Phase 2: Fill intermediate frames
            const remaining: number[] = [];
            for (let i = 0; i < frameCount; i++) {
                if (!keyframes.includes(i)) {
                    remaining.push(i);
                }
            }
            // Load in small batches to avoid overwhelming the browser
            const batchSize = 10;
            for (let b = 0; b < remaining.length; b += batchSize) {
                const batch = remaining.slice(b, b + batchSize);
                await loadBatch(batch);
            }

            setImagesLoaded(true);
        };

        const loadBatch = (indices: number[]): Promise<void> => {
            return new Promise((resolve) => {
                let loaded = 0;
                indices.forEach((i) => {
                    const img = new Image();
                    img.src = `/background/frames-bg-3/bg-terra${i.toString().padStart(3, '0')}.webp`;
                    img.onload = img.onerror = () => {
                        loaded++;
                        imagesRef.current[i] = img;
                        if (loaded === indices.length) resolve();
                    };
                });
            });
        };

        return () => frameObserver.disconnect();
    }, []);

    useEffect(() => {
        if (imagesLoaded) {
            renderFrame(0);
        }
        
        const handleResize = () => {
            if (imagesLoaded) renderFrame(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imagesLoaded, renderFrame]);

    useGSAP(() => {
        if (!imagesLoaded || !canvasContainerRef.current) return;

        const frameData = { frame: 0 };

        gsap.to(frameData, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: canvasContainerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                invalidateOnRefresh: true,
            },
            onUpdate: () => {
                const idx = Math.round(frameData.frame);
                // Only render if that frame has been loaded
                if (imagesRef.current[idx]?.complete) {
                    renderFrame(idx);
                }
            },
        });

    }, { scope: canvasContainerRef, dependencies: [imagesLoaded] });

    // ══════════════════════════════════════════════════════════════
    // ── FRAMER MOTION VARIANTS ──────────────────────────────────
    // ══════════════════════════════════════════════════════════════
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { 
                type: "spring", 
                stiffness: 70,
                damping: 15
            } 
        }
    };

    return (
        <section id="rx-analises" className="pt-6 md:pt-[70px] pb-0 bg-[#000000] relative overflow-hidden flex flex-col" ref={ref}>
            
            {/* Background Animado - Z-0: Contido apenas no final da seção (como divisor/fundo dos botões) */}
            <div ref={canvasContainerRef} className="absolute bottom-0 left-0 right-0 w-full h-[50vh] md:h-[65vh] z-0 pointer-events-none">
                {/* Gradientes para fusão imperceptível com o preto */}
                <div className="absolute inset-x-0 top-0 h-[25vh] md:h-[30vh] bg-gradient-to-b from-[#000000] via-[#000000]/90 to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#040409] via-[#040409]/80 to-transparent z-10" />
                
                {/* O canvas preenche apenas esse container do rodapé */}
                <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full object-cover object-bottom mix-blend-screen"
                    style={{ 
                        opacity: imagesLoaded ? 0.8 : 0,
                        transition: 'opacity 1s ease',
                        willChange: 'contents',
                    }}
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 md:pb-32 relative z-10 flex flex-col items-center justify-center">
                
                {/* Central Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                    {/* Badge - increased margin for better breathing room */}
                    <div className="relative z-20 mb-2 md:mb-20">
                        <SectionBadge icon={<Search className="w-4 h-4" />}>
                            RX Análises
                        </SectionBadge>
                    </div>
                    
                    {/* Title block with Spline as background overlay - increased bottom margin */}
                    <div className="relative w-full flex justify-center mb-12">
                        
                        {/* Spline Overlay — iframe is ALWAYS mounted (preloaded off-screen),
                            only made visible when the user approaches this section */}
                        <div 
                            ref={splineContainerRef}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] md:max-w-none h-[280px] sm:w-[500px] md:w-[780px] md:h-[460px] z-10 pointer-events-auto overflow-hidden"
                            style={{
                                opacity: (splineVisible && splineLoaded) ? 1 : 0,
                                transition: 'opacity 1s ease-in-out',
                            }}
                        >
                            <iframe 
                                ref={splineIframeRef}
                                src="https://my.spline.design/zoomglasscopycopy-ByasteRpGJTAxmapgMznJNdg-C6q/" 
                                frameBorder="0" 
                                className="w-full h-full absolute inset-0"
                                title="RX Análises Visual Effect"
                                style={{
                                    willChange: 'transform',
                                    // Until revealed, hide off-screen so it doesn't
                                    // consume GPU compositing layers visually
                                    ...( !(splineVisible && splineLoaded) ? {
                                        position: 'fixed' as const,
                                        left: '-9999px',
                                        top: '-9999px',
                                        width: '1px',
                                        height: '1px',
                                        pointerEvents: 'none' as const,
                                    } : {}),
                                }}
                            ></iframe>
                            {/* Watermark cover - full bottom edge fade */}
                            <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-[250px] h-[60px] bg-black z-30 pointer-events-none" />
                        </div>

                        {/* Black HTML Title - sits BEHIND Spline */}
                        <h2 className="relative z-0 text-3xl md:text-6xl lg:text-7xl font-bold text-[#000000] tracking-tight leading-tight pointer-events-none select-none max-w-4xl mx-auto" aria-hidden="true">
                            Antes de crescer, é preciso <br className="hidden md:block" /> 
                            <span className="text-[#000000]">enxergar com clareza.</span>
                        </h2>
                    </div>
                    
                    {/* Description - positioned above Spline */}
                    <p className="relative z-20 text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10 max-w-2xl px-4">
                        O <strong className="text-white font-medium">RX Análises</strong> é uma solução voltada para empresas que precisam avaliar melhor seu cenário atual antes de avançar. A proposta é identificar gargalos, oportunidades, prioridades e caminhos mais consistentes para o crescimento.
                    </p>

                    <a
                        href="https://rxanalises.com.br/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 font-semibold text-white text-base sm:text-lg transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden backdrop-blur-md cursor-pointer z-20"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Acessar RX Análises
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400 group-hover:translate-x-1.5 transition-all duration-300" />
                        </span>
                    </a>
                </motion.div>

                {/* Micro-interactive Orbital/Floating Pills */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex flex-wrap justify-center gap-4 md:gap-6 mt-16 md:mt-20 max-w-3xl mx-auto w-full relative z-10 px-2"
                >
                    {keywords.map((kw, idx) => {
                        const staggerClass = idx % 2 === 0 ? "md:mt-8" : "md:-mt-4";
                        
                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={staggerClass}
                                style={{ willChange: 'transform' }}
                            >
                                <motion.div
                                    // Disable infinite float animation on mobile to save battery & CPU
                                    animate={isMobile.current ? undefined : { y: [0, -6, 0] }}
                                    transition={isMobile.current ? undefined : {
                                        duration: 3 + (idx % 3),
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: idx * 0.3
                                    }}
                                    className="group flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-md cursor-default hover:bg-white/[0.06] hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] relative overflow-hidden"
                                    style={{ willChange: 'transform' }}
                                >
                                    {/* Hover sweep effect */}
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                                    
                                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/20 to-transparent border border-primary-500/20 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                        {kw.icon}
                                    </div>
                                    <span className="relative z-10 font-light text-sm md:text-base text-gray-300 group-hover:text-white transition-colors tracking-wide">
                                        {kw.text}
                                    </span>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
            


        </section>
    );
};

export default RxAnalises;
