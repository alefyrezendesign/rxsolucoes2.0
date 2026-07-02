import React, { useRef } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface SectionBadgeProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    /** Pass true for the Hero badge (starts on load, not on scroll) */
    autoStart?: boolean;
    /** Style variant based on background theme */
    variant?: 'dark' | 'light' | 'overlay';
}

/** Extracts a plain-text string from React children (strings & numbers only) */
function extractText(node: React.ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node)) {
        const { children } = node.props as { children?: React.ReactNode };
        return extractText(children);
    }
    return '';
}

const SectionBadge: React.FC<SectionBadgeProps> = ({
    children,
    icon,
    className = '',
    autoStart = false,
    variant = 'dark',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const fullText = extractText(children);
    const { displayed, done } = useTypewriter(fullText, ref, { autoStart });

    // Design Tokens based on variant
    const styles = {
        dark: {
            container: 'bg-white/5 border-white/10 text-gray-300',
            icon: 'text-primary-400',
            caret: 'bg-primary-400'
        },
        light: {
            container: 'bg-primary-50 border-primary-200 text-primary-600',
            icon: 'text-primary-600',
            caret: 'bg-primary-500'
        },
        overlay: {
            container: 'bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]',
            icon: 'text-primary-400',
            caret: 'bg-primary-400'
        }
    }[variant];

    return (
        <div
            ref={ref}
            className={`inline-flex items-center justify-center py-1.5 px-3 border rounded-full mb-8 backdrop-blur-sm transition-all duration-300 w-fit ${styles.container} ${className}`}
        >
            {/* Icon: fade in with the badge */}
            {icon && (
                <span 
                    className={`mr-2 transition-opacity duration-300 shrink-0 ${styles.icon}`} 
                    style={{ opacity: displayed.length > 0 ? 1 : 0.4 }}
                >
                    {icon}
                </span>
            )}

            {/* Screen reader only text */}
            <span className="sr-only">{fullText}</span>

            {/* Typed text — min-width prevents layout shift during typing */}
            <span
                className="text-xs font-semibold tracking-wider uppercase flex items-center"
                style={{ minWidth: `${fullText.length * 0.52}em` }}
                aria-hidden="true"
            >
                {displayed}
                {/* Blinking caret while typing */}
                {!done && (
                    <span className={`inline-block w-[2px] h-[0.85em] ml-[1px] align-middle animate-pulse ${styles.caret}`} aria-hidden="true" />
                )}
            </span>
        </div>
    );
};

export default SectionBadge;
