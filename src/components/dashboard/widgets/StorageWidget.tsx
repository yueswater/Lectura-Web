import { HardDrive } from 'lucide-react';
import { UserProfile } from '@/types';
import { useTranslation } from 'react-i18next';

interface StorageWidgetProps {
    user: UserProfile | null;
}

const StorageWidget = ({ user }: StorageWidgetProps) => {
    const { t, i18n } = useTranslation();

    if (!user) return null;

    const usedStorage = user.current_storage_usage;
    const usagePercentage = (usedStorage / user.storage_limit) * 100;

    const formatSize = (bytes: number) => {
        if (bytes >= 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        } else if (bytes >= 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        } else if (bytes >= 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${bytes} B`;
    };

    const getProgressColor = () => {
        if (usagePercentage >= 90) return 'bg-error';
        if (usagePercentage >= 75) return 'bg-warning';
        return 'bg-accent';
    };

    const isChinese = i18n.language.startsWith('zh');

    return (
        <div className="bg-neutral text-neutral-content rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <HardDrive size={24} className="text-white" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest opacity-60">
                        {t(`storage.tier.${user.tier.toLowerCase()}`)}
                    </span>
                </div>

                <h3 className="text-2xl font-bold mb-2">{t('storage.storage_used')}</h3>

                <div className="space-y-3 mb-8">
                    <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                            className={`${getProgressColor()} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span className={`${usagePercentage >= 90 ? 'text-error font-bold' : 'opacity-60'}`}>
                            {isChinese
                                ? `${t('storage.used')} ${formatSize(usedStorage)}`
                                : `${formatSize(usedStorage)} ${t('storage.used')}`
                            }
                        </span>
                        <span>{formatSize(user.storage_limit)}</span>
                    </div>
                </div>

                {(user.tier === 'BETA' || user.tier === 'FREE') && (
                    <button className="btn bg-white text-neutral border-0 hover:bg-gray-100 rounded-2xl w-full">
                        {t('storage.upgrade_to_pro')}
                    </button>
                )}
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>
    );
};

export default StorageWidget;