import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import AlertModal from '@/components/common/AlertModal';
import MailSentAnimation from '@/components/common/MailSentAnimation';
import Navbar from '@/components/layout/Navbar';
import { useTranslation } from 'react-i18next';
import { Loader2, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, level: 'info' as 'info' | 'error', title: '', content: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setShowAnimation(true);
            setTimeout(() => {
                setShowAnimation(false);
                setModal({
                    isOpen: true,
                    level: 'info',
                    title: t('auth.reset.request_sent_title'),
                    content: t('auth.reset.request_sent_content')
                });
            }, 1500);
        } catch (err: any) {
            setModal({
                isOpen: true,
                level: 'error',
                title: t('auth.reset.error_title'),
                content: err.response?.data?.email?.[0] || t('auth.reset.request_error')
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        const wasSuccessful = modal.level === 'info';
        setModal({ ...modal, isOpen: false });
        if (wasSuccessful) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            <MailSentAnimation isVisible={showAnimation} />
            <Navbar onOpenSidebar={() => { }} />
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <form onSubmit={handleSubmit} className="card-body">
                        <h2 className="card-title text-2xl font-black mb-2">{t('auth.reset.forgot_password')}</h2>
                        <p className="text-sm opacity-60 mb-6">{t('auth.reset.forgot_desc')}</p>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase tracking-widest opacity-50">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="input input-bordered w-full pl-12"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
                            </div>
                        </div>

                        <div className="form-control mt-8">
                            <button className="btn btn-neutral w-full rounded-xl" disabled={loading}>
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                {t('auth.reset.send_request')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <AlertModal {...modal} onClose={handleCloseModal} />
        </div>
    );
};

export default ForgotPassword;