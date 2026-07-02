import { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PartnerModal from './components/PartnerModal';
import { PartnerModalProvider } from './context/PartnerModalContext';
import SolutionsModal from './components/SolutionsModal';
import { SolutionsModalProvider } from './context/SolutionsModalContext';
import ContactLeadModal from './components/ContactLeadModal';
import { ContactLeadModalProvider } from './context/ContactLeadModalContext';
import FloatingActionMenu from './components/FloatingActionMenu';

// Pages
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Partners from './pages/Partners';
// Importação da nova página de Ofertas
import Offers from './pages/Offers';

const Footer = lazy(() => import('./components/Footer'));
const SectionSkeleton = () => <div className="min-h-[400px] bg-black border-b border-white/5" />;

const App = () => {
  return (
    <Router>
      <ContactLeadModalProvider>
        <SolutionsModalProvider>
          <PartnerModalProvider>
            <LazyMotion features={domAnimation} strict>
            <main className="bg-black min-h-screen font-sans selection:bg-primary-500/30 selection:text-white relative flex flex-col">
              <Header />

              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/ofertas" element={<Offers />} />
                  <Route path="/solucoes" element={<Solutions />} />
                  <Route path="/parceiros" element={<Partners />} />
                </Routes>
              </div>

              <Suspense fallback={<SectionSkeleton />}>
                <Footer />
              </Suspense>
            </main>

            {/* Modais flutuantes renderizados fora do fluxo */}
            <PartnerModal />
            <SolutionsModal />
            <ContactLeadModal />
            <FloatingActionMenu />
          </LazyMotion>
        </PartnerModalProvider>
      </SolutionsModalProvider>
      </ContactLeadModalProvider>
    </Router>
  );
};

export default App;
