import { useContactLeadModal } from '../context/ContactLeadModalContext';

const Footer = () => {
    const { openContactModal } = useContactLeadModal();

    return (
        <footer className="bg-black border-t border-white/10 py-16">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-3">
                        <img src="/logo/rx-logo-branca.webp" alt="RX Soluções" className="h-6 sm:h-8 md:h-10 w-auto opacity-90" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => openContactModal({
                                redirectUrl: 'https://wa.me/5521998689659?text=Ol%C3%A1%21%20Estou%20acessando%20o%20site%20da%20RX%20Solu%C3%A7%C3%B5es%20e%20gostaria%20de%20um%20atendimento.',
                                prefilledData: { type: 'Contato Geral / Atendimento' }
                            })}
                            aria-label="WhatsApp"
                            className="text-white/70 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.11 1.11 0 0 0-.806.372c-.272.298-1.039 1.015-1.039 2.477 0 1.462 1.064 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.982 1.286 2.982.852 3.525.802.543-.049 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                            </svg>
                        </button>
                        
                        {/* Instagram icon (line/outline) */}
                        <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                <circle cx="12" cy="12" r="5" />
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                            </svg>
                        </a>
                        
                        {/* Facebook icon (line/outline) */}
                        <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        Conectando soluções, parceiros e oportunidades.
                    </p>
                    <p className="text-gray-500 text-xs text-center md:text-right">
                        © {new Date().getFullYear()} RX Soluções. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
