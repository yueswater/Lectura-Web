import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import AlertModal from '@/components/common/AlertModal';
import Navbar from '@/components/layout/Navbar';
import { useTranslation } from 'react-i18next';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const ResetPasswordConfirm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, level: 'info' as 'info' | 'error', title: '', content: '' });

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.confirmPasswordReset(token, otp, newPassword);
            setModal({
                isOpen: true,
                level: 'info',
                title: t('auth.reset.success_title'),
                content: t('auth.reset.success_content'),
            });
        } catch (err: any) {
            setModal({
                isOpen: true,
                level: 'error',
                title: t('auth.reset.error_title'),
                content: err.response?.data?.token?.[0] || err.response?.data?.otp?.[0] || t('auth.reset.confirm_error')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            <Navbar onOpenSidebar={function (): void {
                throw new Error('Function not implemented.');
            }} />
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <form onSubmit={handleConfirm} className="card-body gap-4">
                        <h2 className="card-title text-2xl font-black">{t('auth.reset.set_new_password')}</h2>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase tracking-widest opacity-50">Verification Code (7 chars)</label>
                            <input
                                type="text"
                                maxLength={7}
                                className="input input-bordered text-center tracking-[0.5em] font-mono text-xl"
                                placeholder="_______"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.toUpperCase())}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase tracking-widest opacity-50">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pr-12"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button className="btn btn-neutral w-full mt-4" disabled={loading}>
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {t('auth.reset.confirm_button')}
                        </button>
                    </form>
                </div>
            </div>

            <AlertModal
                {...modal}
                onClose={() => {
                    setModal({ ...modal, isOpen: false });
                    if (modal.level === 'info') navigate('/login');
                }}
            />
        </div>
    );
};

export default ResetPasswordConfirm;