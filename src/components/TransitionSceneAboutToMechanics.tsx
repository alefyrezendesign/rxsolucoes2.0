import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import About from './About';
import HowItWorks from './HowItWorks';

gsap.registerPlugin(ScrollTrigger);

const CinematicScrollScene = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const mechanicsRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        let mm = gsap.matchMedia();

        // ─── DESKTOP (Scroll = Horizontal Scrub) ───
        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "bottom bottom", 
                    scrub: 0.4, 
                    invalidateOnRefresh: true,
                }
            });

            // Phase 1: About exits upward
            tl.to(aboutRef.current, { yPercent: -100, scale: 0.85, autoAlpha: 0, ease: "power2.inOut", duration: 1 }, 0);
            
            // Phase 1b: Mechanics enters
            tl.fromTo(mechanicsRef.current, { yPercent: 80, scale: 0.85, opacity: 0 }, { yPercent: 0, scale: 1, opacity: 1, ease: "none", duration: 0.85 }, 0.15);

            // Phase 2: Horizontal scroll for Mechanics
            if (trackRef.current) {
                tl.to(trackRef.current, {
                    x: () => -(trackRef.current!.scrollWidth - window.innerWidth),
                    ease: "none",
                    duration: 3
                });
            }
            tl.to({}, { duration: 0.85 });
        });

        // ─── MOBILE (Touch Horizontal Normal Flow) ───
        mm.add("(max-width: 767px)", () => {
            // A dica horizontal agora está gerenciada interinamente pelo HowItWorks.tsx num loop a cada 3s.
        });

    }, { scope: wrapperRef });

    return (
        <div id="sobre" ref={wrapperRef} className="relative w-full z-10 md:h-[700vh] h-auto">
            {/* O container pegajoso no desktop. Fluxo normal no mobile */}
            <div ref={containerRef} className="md:sticky md:top-0 md:left-0 w-full md:h-screen bg-black md:bg-[#040409] flex flex-col md:overflow-hidden rounded-t-[2.5rem] shadow-[0_-5px_25px_rgba(0,0,0,0.4)] z-[1]">
                {/* About Layer (Block no Mobile, Absolute overlapping no Desktop) */}
                <div ref={aboutRef} className="relative md:absolute md:inset-0 w-full md:h-full bg-black md:bg-[#040409] z-20 flex items-center justify-center md:pointer-events-none pb-2 pt-16 md:py-0 rounded-t-[2.5rem]">
                    <About />
                </div>

                {/* Mechanics Layer (Block no Mobile, Absolute overlapping no Desktop) */}
                <div ref={mechanicsRef} className="relative md:absolute md:inset-0 w-full md:h-full bg-transparent z-10 md:overflow-hidden pb-12 md:pb-0">
                    <HowItWorks ref={trackRef} />
                </div>
            </div>
        </div>
    );
};

export default CinematicScrollScene;
