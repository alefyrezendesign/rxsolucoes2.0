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
