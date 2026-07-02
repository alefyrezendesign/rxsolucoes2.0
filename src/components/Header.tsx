import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Se houver um hash na URL ao carregar a página (ex: /#sobre), rola até lá
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, hash?: string) => {
        e.preventDefault();
        setIsMenuOpen(false);
        
        if (path === location.pathname) {
            if (hash) {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            navigate(hash ? `${path}#${hash}` : path);
        }
    };

    const navLinks = [
        { name: 'Início', path: '/', hash: '' },
        { name: 'Ofertas', path: '/ofertas', hash: '' },
        { name: 'Soluções', path: '/solucoes', hash: '' },
        { name: 'Parceiros', path: '/parceiros', hash: '' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled || isMenuOpen
                ? 'bg-black/80 backdrop-blur-xl py-3 md:py-3 border-gray-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                : 'bg-transparent py-4 md:py-6 border-transparent'
                }`}
        >
            <div className="w-full px-4 md:px-8 xl:px-12 mx-auto flex items-center justify-between mt-1 md:mt-2 transition-all">
                
                {/* Logo */}
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 sm:gap-3 z-50 relative shrink-0">
                    <img
                        src="/logo/rx-logo-branca.webp"
                        alt="RX Soluções"
                        width={264}
                        height={56}
                        fetchPriority="high"
                        className="h-6 sm:h-7 md:h-10 w-auto py-0.5"
                    />
                </Link>

                {/* Right Group: CTA + Menu Dropdown Toggle */}
                <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 relative z-50 shrink-0">
                    
                    {/* Portal Target for Solutions Breadcrumbs */}
                    <div id="header-breadcrumb-portal" className="hidden lg:flex items-center justify-end mr-2"></div>

                    <button
                        onClick={() => { navigate('/solucoes'); setIsMenuOpen(false); }}
                        className="bg-white/10 border border-primary-500/50 text-white px-2 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 rounded-full font-semibold text-[9px] sm:text-[11px] md:text-sm hover:bg-primary-500/20 hover:border-primary-400 transition-all shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] cursor-pointer"
                    >
                        <span className="hidden sm:inline">Conhecer Soluções</span>
                        <span className="sm:hidden">Soluções</span>
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`group flex items-center justify-center gap-1 sm:gap-2 md:gap-3 px-2.5 py-1.5 sm:px-5 sm:py-2 md:py-2.5 rounded-full font-bold text-[9px] sm:text-xs md:text-sm tracking-widest uppercase transition-all duration-300 border backdrop-blur-md cursor-pointer
                            ${isMenuOpen 
                                ? 'bg-white text-zinc-950 border-transparent shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                                : 'bg-[#18181A] text-white border-white/10 hover:bg-[#202022] hover:border-white/20'
                            }
                        `}
                    >
                        <span className="mt-[1px]">{isMenuOpen ? 'Fechar' : 'Menu'}</span>
                        
                        <div className={`flex flex-row items-center justify-center gap-[3px] transition-transform duration-300 origin-center ${isMenuOpen ? 'rotate-90' : 'group-hover:rotate-90'}`}>
                            <div className={`w-[4px] h-[4px] rounded-full transition-colors ${isMenuOpen ? 'bg-zinc-950' : 'bg-white'}`} />
                            <div className={`w-[4px] h-[4px] rounded-full transition-colors ${isMenuOpen ? 'bg-zinc-950' : 'bg-white'}`} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                                transition={{ duration: 0.25, type: "spring", stiffness: 350, damping: 25 }}
                                className="absolute top-full mt-4 right-0 min-w-[220px] md:min-w-[280px] bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 md:p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] origin-top-right flex flex-col overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] pointer-events-none rounded-full" />
                                
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={i}
                                        href={link.hash ? `${link.path}#${link.hash}` : link.path}
                                        onClick={(e) => handleNavClick(e, link.path, link.hash)}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.05, duration: 0.3 }}
                                        className="group flex items-center justify-between p-2 md:p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer relative z-10"
                                    >
                                        <span className="text-white text-xs md:text-sm font-semibold tracking-wide group-hover:text-primary-400 transition-colors uppercase">
                                            {link.name}
                                        </span>
                                        <ArrowRight size={16} className="text-white/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary-400 transition-all duration-300" />
                                    </motion.a>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
            
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm -mt-[80px]"
                        style={{ height: '120vh' }}
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

