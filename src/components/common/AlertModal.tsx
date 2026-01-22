import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    level: 'info' | 'warning' | 'error';
    actionLabel?: string;
    onAction?: () => void;
}

const AlertModal = ({ isOpen, onClose, title, content, level, actionLabel, onAction }: AlertModalProps) => {
    const { t } = useTranslation();
    if (!isOpen) return null;
    const config = {
        info: {
            icon: Info,
            color: 'text-info',
            bg: 'bg-info/10',
            border: 'border-info/20',
            btn: 'btn-info'
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-warning',
            bg: 'bg-warning/10',
            border: 'border-warning/20',
            btn: 'btn-warning'
        },
        error: {
            icon: AlertCircle,
            color: 'text-error',
            bg: 'bg-error/10',
            border: 'border-error/20',
            btn: 'btn-error'
        }
    };

    const style = config[level];
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-base-300/30">
            <div className={`relative w-full max-w-md bg-base-100 rounded-[2.5rem] shadow-2xl border ${style.border} p-8 animate-in fade-in zoom-in duration-200`}>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle opacity-40 hover:opacity-100"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 ${style.bg} ${style.color} rounded-3xl mb-6`}>
                        <Icon size={40} />
                    </div>

                    <h3 className={`text-2xl font-black mb-4 ${style.color}`}>
                        {title}
                    </h3>

                    <p className="text-base-content/70 leading-relaxed mb-8">
                        {content}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="btn flex-1 rounded-2xl btn-ghost bg-base-200/50"
                        >
                            {t('common.close')}
                        </button>
                        {actionLabel && onAction && (
                            <button
                                onClick={onAction}
                                className={`btn flex-1 rounded-2xl text-white border-none ${style.btn} shadow-lg shadow-current/20`}
                            >
                                {actionLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;