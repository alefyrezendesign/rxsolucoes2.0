import { createContext, useState, useCallback, type ReactNode } from 'react';

interface SolutionsModalContextType {
    isOpen: boolean;
    initialInterest: string;
    openModal: (interest?: string) => void;
    closeModal: () => void;
}

export const SolutionsModalContext = createContext<SolutionsModalContextType | null>(null);

export function SolutionsModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialInterest, setInitialInterest] = useState('');

    const openModal = useCallback((interest?: string) => {
        setInitialInterest(interest || '');
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setInitialInterest('');
    }, []);

    return (
        <SolutionsModalContext.Provider value={{ isOpen, initialInterest, openModal, closeModal }}>
            {children}
        </SolutionsModalContext.Provider>
    );
}


