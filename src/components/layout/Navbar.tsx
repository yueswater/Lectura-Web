import { Link } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import authService from '@/services/authService';
import ThemeController from './ThemeController';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
    onOpenSidebar: () => void;
}

const Navbar = ({ onOpenSidebar }: NavbarProps) => {
    const { t } = useTranslation();
    const isAuth = authService.isAuthenticated();
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            setCurrentTheme(theme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        const handleStorageChange = () => {
            setCurrentTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    const logoSrc = (currentTheme === 'dark' || currentTheme === 'nord')
        ? '/logo_white.png'
        : '/logo_dark.png';

    return (
        <div className="bg-base-100/80 backdrop-blur-md text-base-content w-full shadow-sm sticky top-0 z-50 border-b border-base-content/5 transition-colors duration-300">
            <div className="navbar container mx-auto px-4 py-4">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <Menu size={20} />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a href="#features">{t('nav.features')}</a></li>
                            <li><a href="#pricing">{t('nav.pricing')}</a></li>
                            <li><a href="#faq">{t('nav.faq')}</a></li>
                        </ul>
                    </div>
                    <Link to="/" className="flex items-center gap-2 px-2 btn btn-ghost normal-case hover:bg-transparent transition-all duration-300">
                        <img
                            src={logoSrc}
                            alt="Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-2xl font-bold tracking-tighter">Lectura</span>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 font-medium text-base">
                        <li><a href="#features">{t('nav.feature')}</a></li>
                        <li><a href="#pricing">{t('nav.pricing')}</a></li>
                        <li><a href="#faq">{t('nav.faq')}</a></li>
                    </ul>
                </div>

                <div className="navbar-end gap-2">
                    <LanguageSwitcher />
                    <ThemeController />

                    {isAuth ? (
                        <button
                            onClick={onOpenSidebar}
                            className="btn btn-ghost btn-circle avatar placeholder hover:bg-base-content/10 transition-colors"
                        >
                            <div className="bg-neutral text-neutral-content rounded-full w-10 ring ring-base-content/5 ring-offset-2 ring-offset-base-100">
                                <User size={20} />
                            </div>
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">
                                {t('nav.sign_in')}
                            </Link>
                            <Link to="/register" className="btn btn-neutral rounded-full px-6 text-white">
                                {t('nav.get_started')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;