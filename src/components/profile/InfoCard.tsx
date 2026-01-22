import { useState } from 'react';
import { UserProfile } from '@/types';
import PasswordSection from './PasswordSection';
import { formatFullName } from '@/utils/userUtils';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

interface Props {
    user: UserProfile | null;
}

const InfoCard = ({ user }: Props) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className="bg-base-100 flex flex-col min-h-[500px]">
            <div className="flex border-b border-base-200 gap-10">
                {['account', 'security'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-xm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab
                            ? 'border-neutral text-neutral'
                            : 'border-transparent opacity-30 hover:opacity-100'
                            }`}
                    >
                        {t(`profile.tabs.${tab}`)}
                    </button>
                ))}
            </div>

            <div className="py-12 flex-1">
                {activeTab === 'account' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em]">{t('profile.account.full_name')}</label>
                            <p className="text-xl font-medium">{formatFullName(user, i18n.language)}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em]">{t('profile.account.username')}</label>
                            <p className="text-xl font-medium">{user?.username || '—'}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em]">{t('profile.account.email')}</label>
                            <p className="text-xl font-medium">{user?.email || '—'}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em]">
                                {t('profile.account.tier')}
                            </label>
                            <div className="flex items-center gap-3">
                                <p className="text-xl font-bold text-accent">
                                    {/* Convert user.tier to lowercase to match your JSON keys */}
                                    {user?.tier ? t(`storage.tier.${user.tier.toLowerCase()}`) : '—'}
                                </p>
                                <span className="badge badge-neutral badge-sm rounded-md px-2 py-3 text-[9px] font-black">
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <PasswordSection />
                )}
            </div>

            {/* <div className="pt-8 border-t border-base-200 flex justify-end">
                <button className="btn btn-accent text-accent-content px-12 rounded-xl shadow-lg shadow-accent/20">
                    Edit Profile
                </button>
            </div> */}
        </div>
    );
};

export default InfoCard;