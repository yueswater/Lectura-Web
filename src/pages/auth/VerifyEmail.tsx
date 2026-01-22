import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Loader2, Info } from 'lucide-react';
import authService from '@/services/authService';
import Navbar from '@/components/layout/Navbar';

function VerifyEmail() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading');
    const [countdown, setCountdown] = useState(5);

    const verificationStarted = useRef(false);

    useEffect(() => {
        if (!token || verificationStarted.current) return;

        const verify = async () => {
            verificationStarted.current = true;
            try {
                const response = await authService.verifyEmail(token);

                if (response.data && response.data.status === 'already_verified') {
                    setStatus('already_verified');
                } else {
                    setStatus('success');
                }
            } catch (err) {
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'already_verified' && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (status === 'already_verified' && countdown === 0) {
            navigate('/');
        }
        return () => clearTimeout(timer);
    }, [status, countdown, navigate]);

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar onOpenSidebar={() => { }} />

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="card w-full max-w-md bg-base-100 shadow-xl text-center">
                    <div className="card-body items-center py-12">

                        {status === 'loading' && (
                            <>
                                <Loader2 size={48} className="animate-spin text-neutral mb-6" />
                                <h2 className="card-title text-2xl font-bold">{t('auth.verify.verifying')}</h2>
                            </>
                        )}

                        {status === 'already_verified' && (
                            <>
                                <div className="w-20 h-20 bg-info/10 text-info rounded-full flex items-center justify-center mb-6">
                                    <Info size={40} />
                                </div>
                                <h2 className="card-title text-2xl font-bold mb-2">{t('auth.verify.already_verified_title')}</h2>
                                <p className="text-base-content/70 mb-4">{t('auth.verify.already_verified_msg')}</p>
                                <div className="badge badge-ghost p-4 gap-2">
                                    {t('common.redirecting')} in <span className="font-mono font-bold text-lg">{countdown}</span> s
                                </div>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="card-title text-2xl font-bold mb-2">{t('auth.verify.success_title')}</h2>
                                <p className="text-base-content/70 mb-8">{t('auth.verify.success_msg')}</p>
                                <Link to="/login" className="btn btn-neutral rounded-full px-8 w-full">
                                    {t('auth.sign_in')}
                                </Link>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
                                    <XCircle size={40} />
                                </div>
                                <h2 className="card-title text-2xl font-bold mb-2">{t('auth.verify.fail_title')}</h2>
                                <p className="text-base-content/70 mb-8">{t('auth.verify.fail_msg')}</p>
                                <Link to="/register" className="btn btn-ghost rounded-full px-8 w-full mb-2">
                                    {t('auth.verify.try_again')}
                                </Link>
                                <Link to="/" className="btn btn-link no-underline text-base-content/50">
                                    {t('common.back_to_home')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;