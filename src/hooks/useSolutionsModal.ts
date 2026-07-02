import { useContext } from 'react';
import { SolutionsModalContext } from '../context/SolutionsModalContext';

export function useSolutionsModal() {
    const ctx = useContext(SolutionsModalContext);
    if (!ctx) throw new Error('useSolutionsModal must be used within SolutionsModalProvider');
    return ctx;
}
