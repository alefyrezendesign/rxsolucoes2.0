import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';

// Home Sections
import HomeAbout from '../components/HomeAbout';
import HomeOffers from '../components/HomeOffers';
import HomeSolutions from '../components/HomeSolutions';
import HomePartners from '../components/HomePartners';

const Audience = lazy(() => import('../components/Audience'));

const SectionSkeleton = () => <div className="min-h-[400px] bg-black border-b border-white/5" />;

const Home = () => {
  return (
    <>
      <Hero />
      <div className="relative z-30 w-full bg-[#040409]">
          <HomeAbout />
          <HomeOffers />
          <HomeSolutions />

          <div className="relative w-full bg-black overflow-hidden flex flex-col">
              {/* Shared Background Image - Spans across both sections from behind */}
              <div className="absolute bottom-0 left-0 right-0 w-full h-[80vh] md:h-[120vh] z-0 pointer-events-none">
                  <div className="absolute inset-x-0 top-0 h-[30vh] bg-gradient-to-b from-[#000000] via-[#000000]/90 to-transparent z-10"></div>
                  <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent z-10"></div>
                  <img 
                      src="/background/bg-final-home.jpg"
                      alt="Fundo Terra"
                      className="absolute inset-0 w-full h-full object-cover object-bottom mix-blend-screen opacity-90"
                  />
              </div>

              <div className="relative z-10 w-full flex flex-col">
                  <Suspense fallback={<SectionSkeleton />}>
                      <Audience />
                  </Suspense>
                  <HomePartners />
              </div>
          </div>
      </div>
    </>
  );
};

export default Home;
