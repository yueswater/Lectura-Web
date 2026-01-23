import { useState, useRef } from 'react';
import { Camera, User, Loader2 } from 'lucide-react';
import authService from '@/services/authService';
import { UserProfile } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
    user: UserProfile | null;
    onUpdate: () => void;
}

const AvatarCard = ({ user, onUpdate }: Props) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        setUploading(true);
        try {
            await authService.updateProfile(formData);
            onUpdate();
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const formatSize = (bytes: number) => {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-200">
            <div className="p-8 flex flex-col items-center">
                <div className="relative mb-6">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-base-200 flex items-center justify-center">
                        {uploading ? (
                            <Loader2 className="animate-spin text-accent" size={32} />
                        ) : user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                        ) : (
                            <User size={64} className="opacity-20" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-2 right-2 p-2.5 bg-accent text-base-100 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
                    >
                        <Camera size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <h2 className="text-2xl font-bold text-base-content">{user?.username}</h2>
                <p className="text-xm opacity-50 uppercase tracking-[0.2em] font-bold mt-2 text-accent/90">
                    {user?.tier ? t(`storage.tier.${user.tier.toLowerCase()}`) : '—'}
                </p>
            </div>

            <div className="border-t border-base-200 divide-y divide-base-200 bg-base-50/30">
                <div className="p-5 flex justify-between items-center px-8">
                    <span className="text-xs font-bold uppercase opacity-40">{t('storage.storage_used')}</span>
                    <span className="text-sm font-bold">{formatSize(user?.current_storage_usage || 0)}</span>
                </div>
                <div className="p-5 flex justify-between items-center px-8">
                    <span className="text-xs font-bold uppercase opacity-40">{t('storage.storage_limit')}</span>
                    <span className="text-sm font-bold">{formatSize(user?.storage_limit || 0)}</span>
                </div>
            </div>
        </div>
    );
};

export default AvatarCard;