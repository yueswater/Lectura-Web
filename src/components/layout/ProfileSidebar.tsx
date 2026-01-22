import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, Settings, LogOut, X } from 'lucide-react';
import authService from '@/services/authService';
import { UserProfile } from '@/types';
import { useTranslation } from 'react-i18next';

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to load user profile', error);
            }
        };

        if (isOpen) {
            fetchUserProfile();
        }
    }, [isOpen]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        onClose();
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="absolute inset-0 bg-base-100/60 backdrop-blur-none bg-transparent border-l border-none" />

            <div className="relative h-full flex flex-col p-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-bold text-base-content">{t('profile_sidebar.profile')}</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center mb-10">
                    <div className="avatar placeholder mb-4">
                        <div className="bg-neutral text-neutral-content rounded-full w-24 shadow-xl ring-4 ring-base-100 overflow-hidden">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl"><User size={40} /></span>
                            )}
                        </div>
                    </div>
                    <p className="font-bold text-lg text-base-content">
                        {user?.username || 'Loading...'}
                    </p>
                    <p className="text-sm text-base-content/60">
                        {user?.email || '...'}
                    </p>
                </div>

                <nav className="flex-1">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link
                                to="/profile"
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-base-content/5 transition-colors text-base-content/80 hover:text-base-content font-medium"
                            >
                                <User size={20} />
                                {t('profile_sidebar.profile')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/dashboard"
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-base-content/5 transition-colors text-base-content/80 hover:text-base-content font-medium"
                            >
                                <LayoutDashboard size={20} />
                                {t('profile_sidebar.dashboard')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-base-content/5 transition-colors text-base-content/80 hover:text-base-content font-medium"
                            >
                                <Settings size={20} />
                                {t('profile_sidebar.settings')}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="pt-6 border-t border-base-content/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-all font-medium"
                    >
                        <LogOut size={18} />
                        {t('profile_sidebar.sign_out')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;