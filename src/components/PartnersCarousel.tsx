import { useRef, useEffect, useCallback } from 'react';

const IMAGES = [
  '/parceiros-carrossel/parceiros-desktop-01.webp',
  '/parceiros-carrossel/parceiros-desktop-02.webp',
  '/parceiros-carrossel/parceiros-desktop-03.webp',
];

// Enough copies to always cover the viewport + overflow
const COPIES = 4;
// Base speed in px/s
const BASE_SPEED = 50;

/**
 * Scroll-reactive infinite marquee.
 * - Moves left by default.
 * - Reverses direction while the user scrolls in the opposite direction.
 * - Alternates direction per row.
 * - No hover pause, transparent bg, seamless loop.
 */
const PartnersCarousel = () => {
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRefs = useRef([0, 0, 0]);
  const directionRef = useRef(-1); // -1 left, 1 right
  const singleWRef = useRef([0, 0, 0]);
  const rafRef = useRef(0);
  const prevTimeRef = useRef(0);
  const prevScrollRef = useRef(0);

  /* ── Scroll direction detection ────────────────────────── */
  // Direction only changes when the user actually scrolls in the opposite sense.
  // No timer reset — it stays in the last detected direction.
  const onScroll = useCallback(() => {
    const y = window.scrollY;
    const delta = y - prevScrollRef.current;
    if (Math.abs(delta) > 2) {
      directionRef.current = delta > 0 ? -1 : 1;
    }
    prevScrollRef.current = y;
  }, []);

  /* ── Measure one image width ───────────────────────────── */
  const measure = useCallback((index: number) => {
    const track = trackRefs.current[index];
    if (!track) return;
    const img = track.querySelector('img');
    if (img && img.offsetWidth > 0) {
      singleWRef.current[index] = img.offsetWidth;
    }
  }, []);

  /* ── Animation loop ────────────────────────────────────── */
  useEffect(() => {
    prevScrollRef.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = (t: number) => {
      if (!prevTimeRef.current) prevTimeRef.current = t;
      const dt = (t - prevTimeRef.current) / 1000;
      prevTimeRef.current = t;

      IMAGES.forEach((_, i) => {
        // Alternating directions: track 0 and 2 go same as scroll direction, track 1 goes opposite
        const dir = directionRef.current * (i % 2 === 0 ? 1 : -1);
        offsetRefs.current[i] += BASE_SPEED * dir * dt;

        // Seamless wrapping
        const w = singleWRef.current[i];
        if (w > 0) {
          while (offsetRefs.current[i] <= -w) offsetRefs.current[i] += w;
          while (offsetRefs.current[i] >= 0) offsetRefs.current[i] -= w;
        }

        const tx = `translateX(${offsetRefs.current[i]}px)`;
        const track = trackRefs.current[i];
        if (track) track.style.transform = tx;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return (
    <div className="w-full overflow-hidden pt-6 pb-4 md:pt-10 md:pb-4 flex flex-col gap-6">
      {IMAGES.map((imgSrc, rowIndex) => (
        <div
          key={imgSrc}
          ref={(el) => {
            trackRefs.current[rowIndex] = el;
          }}
          className="flex items-center will-change-transform"
          style={{ width: 'max-content' }}
        >
          {Array.from({ length: COPIES }).map((_, i) => (
            <img
              key={i}
              src={imgSrc}
              alt={`Parceiros RX Soluções linha ${rowIndex + 1}`}
              onLoad={i === 0 ? () => measure(rowIndex) : undefined}
              draggable={false}
              className="h-20 sm:h-24 md:h-16 lg:h-20 xl:h-24 max-w-none object-contain select-none pointer-events-none flex-shrink-0"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PartnersCarousel;
