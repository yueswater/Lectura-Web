import { useTranslation } from 'react-i18next';
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import authService from '@/services/authService';
import Navbar from '@/components/layout/Navbar';
const REMEMBER_ME_KEY = 'remembered_user';
const EXPIRATION_DAYS = 3;

function Login() {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem(REMEMBER_ME_KEY);
        if (storedData) {
            const { username: savedUsername, timestamp } = JSON.parse(storedData);
            const now = new Date().getTime();
            const daysDiff = (now - timestamp) / (1000 * 60 * 60 * 24);

            if (daysDiff > EXPIRATION_DAYS) {
                localStorage.removeItem(REMEMBER_ME_KEY);
            } else {
                setUsername(savedUsername);
                setRememberMe(true);
            }
        }
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(username, password);

            if (rememberMe) {
                const data = {
                    username,
                    timestamp: new Date().getTime()
                };
                localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(data));
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar onOpenSidebar={() => { }} />

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold justify-center mb-6 text-base-content">{t('auth.welcome')}</h2>

                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            {error && (
                                <div className="alert alert-error text-sm py-2 rounded-lg">
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">{t('auth.username')}</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('auth.placeholders.username')}
                                    className="input input-bordered focus:input-neutral w-full rounded-full"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">{t('auth.password')}</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('auth.placeholders.password')}
                                        className="input input-bordered focus:input-neutral w-full rounded-full pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-neutral transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="label cursor-pointer flex gap-2">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm checkbox-neutral rounded-md"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="label-text">{t('auth.remember_me')}</span>
                                </label>
                                <a href="/forgot-password" className="label-text-alt link link-hover text-neutral-content hover:text-neutral">{t('auth.forgot_password')}</a>
                            </div>

                            <div className="form-control mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-neutral w-full text-neutral-content rounded-full"
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner"></span> : t('auth.sign_in')}
                                </button>
                            </div>
                        </form>

                        <div className="divider text-xs text-base-content/50">{t('common.or')}</div>

                        <div className="text-center text-sm">
                            {t('auth.no_account')}{' '}
                            <a href="/register" className="link link-neutral font-bold no-underline hover:text-info">
                                {t('auth.sign_up')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;