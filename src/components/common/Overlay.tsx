import React from 'react';

interface OverlayProps {
    show: boolean;
    children?: React.ReactNode;
    blurAmount?: 'sm' | 'md' | 'lg' | 'xl';
}

const Overlay = ({ show, children, blurAmount = 'md' }: OverlayProps) => {
    if (!show) return null;

    const blurClasses = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
    };

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 ${blurClasses[blurAmount]} transition-all duration-300`}>
            <div className="animate-in fade-in zoom-in duration-300">
                {children}
            </div>
        </div>
    );
};

export default Overlay;