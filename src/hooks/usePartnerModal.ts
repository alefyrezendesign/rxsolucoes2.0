import { useContext } from 'react';
import { PartnerModalContext } from '../context/PartnerModalContext';

export function usePartnerModal() {
    const ctx = useContext(PartnerModalContext);
    if (!ctx) throw new Error('usePartnerModal must be used within PartnerModalProvider');
    return ctx;
}
