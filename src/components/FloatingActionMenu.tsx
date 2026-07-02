import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Handshake, Headset, X } from 'lucide-react';
import { usePartnerModal } from '../hooks/usePartnerModal';
import { useSolutionsModal } from '../hooks/useSolutionsModal';

const FloatingActionMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { openModal: openPartnerModal } = usePartnerModal();
    const { openModal: openSolutionsModal } = useSolutionsModal();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSolutionsClick = () => {
        openSolutionsModal();
        setIsOpen(false);
    };

    const handlePartnerClick = () => {
        openPartnerModal();
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[90]" ref={menuRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 mb-4 flex flex-col gap-3 min-w-[240px]"
                    >
                        <button
                            onClick={handleSolutionsClick}
                            className="flex items-center gap-3 px-5 py-3.5 bg-[#0a0a0c] border-[2px] border-white/10 hover:border-primary-500/50 rounded-none text-white hover:bg-white/5 transition-all shadow-xl group cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary-500/30 transition-colors">
                                <Headset className="w-4 h-4 text-primary-400" />
                            </div>
                            <span className="text-sm font-semibold tracking-wide whitespace-nowrap">Falar com especialistas</span>
                        </button>

                        <button
                            onClick={handlePartnerClick}
                            className="flex items-center gap-3 px-5 py-3.5 bg-[#0a0a0c] border-[2px] border-white/10 hover:border-primary-500/50 rounded-none text-white hover:bg-white/5 transition-all shadow-xl group cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary-500/30 transition-colors">
                                <Handshake className="w-4 h-4 text-primary-400" />
                            </div>
                            <span className="text-sm font-semibold tracking-wide whitespace-nowrap">Quero ser parceiro</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleMenu}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 z-50 relative cursor-pointer ml-auto ${
                    isOpen ? 'bg-white/10 border-2 border-white/20' : 'bg-primary-600 hover:bg-primary-500'
                }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    );
};

export default FloatingActionMenu;
