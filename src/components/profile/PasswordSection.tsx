import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/services/api';
import AlertModal from '@/components/common/AlertModal';
import { useTranslation } from 'react-i18next';

const PasswordSection = () => {
    const { t } = useTranslation();
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        level: 'info' | 'warning' | 'error';
        title: string;
        content: string;
    }>({
        isOpen: false,
        level: 'info',
        title: '',
        content: ''
    });

    const toggleVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.old === passwords.new) {
            setModalConfig({
                isOpen: true,
                level: 'warning',
                title: t('profile.security.error_title'),
                content: t('profile.security.same_password_error')
            });
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setModalConfig({
                isOpen: true,
                level: 'error',
                title: t('profile.security.error_title'),
                content: t('profile.security.mismatch_error')
            });
            return;
        }

        if (passwords.new.length < 8) {
            setModalConfig({
                isOpen: true,
                level: 'warning',
                title: t('profile.security.error_title'),
                content: t('profile.security.length_error')
            });
            return;
        }

        setLoading(true);
        try {
            await api.post('accounts/change-password/', {
                old_password: passwords.old,
                new_password: passwords.new
            });

            setModalConfig({
                isOpen: true,
                level: 'info',
                title: t('profile.security.success_title'),
                content: t('profile.security.success_message')
            });

            setPasswords({ old: '', new: '', confirm: '' });
        } catch (err: any) {
            const errorMsg = err.response?.data?.old_password?.[0] || t('profile.security.api_error');
            setModalConfig({
                isOpen: true,
                level: 'error',
                title: t('profile.security.error_title'),
                content: errorMsg
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control w-full">
                    <label className="label font-bold text-xs uppercase opacity-60 tracking-widest">
                        {t('profile.security.current_password')}
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswords.old ? "text" : "password"}
                            placeholder="••••••••"
                            className="input input-bordered w-full bg-base-100 focus:border-neutral transition-all pr-12"
                            value={passwords.old}
                            onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => toggleVisibility('old')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                        >
                            {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                        <label className="label font-bold text-xs uppercase opacity-60 tracking-widest">
                            {t('profile.security.new_password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                placeholder="••••••••"
                                className="input input-bordered w-full bg-base-100 focus:border-neutral transition-all pr-12"
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility('new')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-control w-full">
                        <label className="label font-bold text-xs uppercase opacity-60 tracking-widest">
                            {t('profile.security.confirm_new_password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                placeholder="••••••••"
                                className="input input-bordered w-full bg-base-100 focus:border-neutral transition-all pr-12"
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility('confirm')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                            >
                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-neutral rounded-full px-8 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {t('profile.security.update')}
                    </button>
                </div>
            </form>

            <AlertModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                content={modalConfig.content}
                level={modalConfig.level}
            />
        </div>
    );
};

export default PasswordSection;