import { HardDrive } from 'lucide-react';
import { UserProfile, Handout } from '@/types';
import { useTranslation } from 'react-i18next';

interface StorageWidgetProps {
    user: UserProfile | null;
    files?: Handout[];
}

const StorageWidget = ({ user, files = [] }: StorageWidgetProps) => {
    const { t, i18n } = useTranslation();

    if (!user) return null;

    const formatSize = (bytes: number | string) => {
        const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
        if (!numBytes || isNaN(numBytes)) return '0 KB';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(numBytes) / Math.log(k));
        return parseFloat((numBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const calculateUsage = () => {
        if (user.current_storage_usage > 0) return user.current_storage_usage;
        return files.reduce((acc, file) => acc + (Number(file.file_size) || 0), 0);
    };

    const usedStorage = calculateUsage();
    const usagePercentage = (usedStorage / user.storage_limit) * 100;

    const getProgressColor = () => {
        if (usagePercentage >= 90) return 'bg-error';
        if (usagePercentage >= 75) return 'bg-warning';
        return 'bg-accent';
    };

    const isChinese = i18n.language.startsWith('zh');

    return (
        <div className="bg-neutral text-neutral-content rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden flex flex-col justify-between h-full">
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <HardDrive size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                        {t(`storage.tier.${user.tier.toLowerCase()}`)}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{t('storage.storage_used')}</h3>
                <div className="space-y-3 mb-8">
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`${getProgressColor()} h-full rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold tracking-tight">
                        <span className={usagePercentage >= 90 ? 'text-error' : 'opacity-70'}>
                            {isChinese
                                ? `${t('storage.used')} ${formatSize(usedStorage)}`
                                : `${formatSize(usedStorage)} ${t('storage.used')}`
                            }
                        </span>
                        <span className="opacity-40">{formatSize(user.storage_limit)}</span>
                    </div>
                </div>

                {(user.tier === 'BETA' || user.tier === 'FREE') && (
                    <button className="btn bg-white text-neutral border-none hover:bg-white/90 rounded-2xl w-full font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95">
                        {t('storage.upgrade_to_pro')}
                    </button>
                )}
            </div>

            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>
    );
};

export default StorageWidget;