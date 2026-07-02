import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, Store, Hash } from 'lucide-react';
import { useContactLeadModal } from '../context/ContactLeadModalContext';

const ContactLeadModal = () => {
    const { isOpen, closeContactModal, modalData } = useContactLeadModal();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        storeName: '',
        storeCount: ''
    });

    // Handle scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!modalData) return null;

    const { redirectUrl, prefilledData } = modalData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Aqui no futuro será inserida a integração com o RD Station.
        // Simulamos o envio e então fazemos o redirect
        
        console.log("Enviando lead para RD Station:", { ...formData, ...prefilledData });
        
        window.open(redirectUrl, '_blank');
        closeContactModal();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeContactModal}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl bg-black border border-white/10 rounded-none shadow-2xl flex flex-col md:flex-row overflow-hidden"
                        style={{ maxHeight: 'calc(100vh - 2rem)' }}
                    >
                        {/* Sidebar with Prefilled Data */}
                        <div className="w-full md:w-1/3 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                            
                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Qualificação</h3>
                            <p className="text-sm text-gray-400 mb-6 relative z-10">Antes de falar com nossa equipe, preencha seus dados.</p>

                            <div className="space-y-4 relative z-10">
                                <div className="p-3 bg-black/40 border border-white/5">
                                    <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Interesse em</span>
                                    <span className="text-sm text-white font-medium">{prefilledData.type}</span>
                                </div>
                                
                                {prefilledData.segment && (
                                    <div className="p-3 bg-black/40 border border-white/5">
                                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Segmento</span>
                                        <span className="text-sm text-primary-400 font-medium">{prefilledData.segment}</span>
                                    </div>
                                )}
                                
                                {prefilledData.category && (
                                    <div className="p-3 bg-black/40 border border-white/5">
                                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Categoria</span>
                                        <span className="text-sm text-white font-medium">{prefilledData.category}</span>
                                    </div>
                                )}
                                
                                {prefilledData.item && (
                                    <div className="p-3 bg-black/40 border border-white/5">
                                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Item Selecionado</span>
                                        <span className="text-sm text-white font-medium">{prefilledData.item}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto">
                            <button
                                onClick={closeContactModal}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Nome Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="block w-full pl-10 bg-white/5 border border-white/10 text-white py-3 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            placeholder="João da Silva"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">E-mail Corporativo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-10 bg-white/5 border border-white/10 text-white py-3 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            placeholder="joao@empresa.com.br"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">Telefone (WhatsApp)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="block w-full pl-10 bg-white/5 border border-white/10 text-white py-3 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-300 mb-1.5">Nome da Loja / Empresa</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Store className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            id="storeName"
                                            name="storeName"
                                            required
                                            value={formData.storeName}
                                            onChange={handleChange}
                                            className="block w-full pl-10 bg-white/5 border border-white/10 text-white py-3 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Sua Empresa Ltda"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="storeCount" className="block text-sm font-medium text-gray-300 mb-1.5">Quantas lojas tem?</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Hash className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="number"
                                            id="storeCount"
                                            name="storeCount"
                                            min="1"
                                            required
                                            value={formData.storeCount}
                                            onChange={handleChange}
                                            className="block w-full pl-10 bg-white/5 border border-white/10 text-white py-3 px-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Ex: 3"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-6 flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all group cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                                >
                                    Falar no WhatsApp
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ContactLeadModal;
