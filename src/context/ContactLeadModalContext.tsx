import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface ContactModalData {
    redirectUrl: string;
    prefilledData: {
        type: string;
        segment?: string;
        category?: string;
        item?: string;
    }
}

interface ContactLeadModalContextProps {
    isOpen: boolean;
    modalData: ContactModalData | null;
    openContactModal: (data: ContactModalData) => void;
    closeContactModal: () => void;
}

const ContactLeadModalContext = createContext<ContactLeadModalContextProps | undefined>(undefined);

export const ContactLeadModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalData, setModalData] = useState<ContactModalData | null>(null);

    const openContactModal = (data: ContactModalData) => {
        setModalData(data);
        setIsOpen(true);
    };

    const closeContactModal = () => {
        setIsOpen(false);
        // Não limpo os dados imediatamente para não dar glitch visual ao fechar
        setTimeout(() => setModalData(null), 300);
    };

    return (
        <ContactLeadModalContext.Provider value={{ isOpen, modalData, openContactModal, closeContactModal }}>
            {children}
        </ContactLeadModalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContactLeadModal = () => {
    const context = useContext(ContactLeadModalContext);
    if (!context) {
        throw new Error('useContactLeadModal must be used within a ContactLeadModalProvider');
    }
    return context;
};
