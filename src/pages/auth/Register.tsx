import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MailCheck, Eye, EyeOff } from 'lucide-react';
import authService from '@/services/authService';
import Navbar from '@/components/layout/Navbar';

function Register() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(formData);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col">
                <Navbar onOpenSidebar={() => { }} />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="card w-full max-w-md bg-base-100 shadow-xl text-center">
                        <div className="card-body items-center py-12">
                            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                                <MailCheck size={40} />
                            </div>
                            <h2 className="card-title text-2xl font-bold mb-2">{t('auth.check_email')}</h2>
                            <p className="text-base-content/70 mb-8">
                                {t('auth.verification_sent_to')} <span className="font-bold">{formData.email}</span>
                            </p>
                            <Link to="/login" className="btn btn-neutral rounded-full px-8">
                                {t('auth.back_to_login')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar onOpenSidebar={() => { }} />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold justify-center mb-6">{t('auth.create_account')}</h2>
                        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
                            {error && (
                                <div className="alert alert-error text-sm py-2 rounded-lg col-span-2">
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">{t('auth.first_name')}</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full rounded-full"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">{t('auth.last_name')}</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full rounded-full"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label"><span className="label-text font-medium">{t('auth.username')}</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full rounded-full"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label"><span className="label-text font-medium">{t('auth.email')}</span></label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full rounded-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control col-span-2">
                                <label className="label"><span className="label-text font-medium">{t('auth.password')}</span></label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input input-bordered w-full rounded-full pr-12"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-neutral w-full rounded-full col-span-2 mt-4"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : t('auth.sign_up')}
                            </button>
                        </form>
                        <div className="text-center text-sm mt-6">
                            {t('auth.already_have_account')}{' '}
                            <Link to="/login" className="link link-neutral font-bold no-underline">
                                {t('auth.sign_in')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;