import { createContext, useState, useCallback, type ReactNode } from 'react';

interface PartnerModalContextType {
    isOpen: boolean;
    selectedPlan: string;
    openModal: (plan?: string) => void;
    closeModal: () => void;
}

export const PartnerModalContext = createContext<PartnerModalContextType | null>(null);

export function PartnerModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');

    const openModal = useCallback((plan?: string) => {
        setSelectedPlan(plan || '');
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setSelectedPlan('');
    }, []);

    return (
        <PartnerModalContext.Provider value={{ isOpen, selectedPlan, openModal, closeModal }}>
            {children}
        </PartnerModalContext.Provider>
    );
}


