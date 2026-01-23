import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Languages
} from 'lucide-react';
import authService from '@/services/authService';
import { useTranslation } from 'react-i18next';
import ThemeController from '@/components/layout/ThemeController';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'zh_TW', label: '繁中' },
        { code: 'zh_CN', label: '簡中' },
        { code: 'th', label: 'ไทย' }
    ];

    const menuItems = [
        { name: t('dashboard_sidebar.dashboard'), icon: <LayoutDashboard size={22} />, path: '/dashboard' },
        { name: t('dashboard_sidebar.projects'), icon: <FolderKanban size={22} />, path: '/projects' },
        { name: t('dashboard_sidebar.handouts'), icon: <BookOpen size={22} />, path: '/handouts' },
    ];

    const bottomItems = [
        { name: t('dashboard_sidebar.settings'), icon: <Settings size={22} />, path: '/settings' },
    ];

    const isActive = (path: string) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    const Curve = ({ className }: { className?: string }) => (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            preserveAspectRatio="none"
        >
            <path d="M40 40V0C40 22.0914 22.0914 40 0 40H40Z" fill="currentColor" />
        </svg>
    );

    return (
        <div className="flex flex-col h-full bg-neutral text-neutral-content py-6 px-3 overflow-visible w-full transition-all duration-300">
            <div className={`flex items-center mb-10 relative min-h-[40px] ${isCollapsed ? 'justify-center' : 'px-4 justify-between'}`}>
                <Link to="/" className="text-3xl font-bold tracking-tighter text-white whitespace-nowrap overflow-hidden">
                    {isCollapsed ? 'L' : 'Lectura'}
                </Link>

                <button
                    onClick={toggleSidebar}
                    className={`hidden lg:flex btn btn-circle btn-xs btn-ghost text-neutral-content/50 hover:text-white hover:bg-white/10 z-50 
                        ${isCollapsed ? 'absolute -right-6 top-2 bg-neutral shadow-md border border-white/5' : ''}`}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 space-y-4 w-full">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <div key={item.path} className="relative group">
                            {active && (
                                <div className="absolute inset-y-0 -right-3 w-[calc(100%+12px)] z-0 pointer-events-none text-base-200">
                                    <div className="hidden lg:block absolute right-0 -top-10 w-10 h-10">
                                        <Curve className="w-full h-full fill-current" />
                                    </div>
                                    <div className="w-full h-full bg-base-200 lg:rounded-l-[2.5rem]"></div>
                                    <div className="hidden lg:block absolute right-0 -bottom-10 w-10 h-10">
                                        <Curve className="w-full h-full fill-current scale-y-[-1]" />
                                    </div>
                                </div>
                            )}

                            <Link
                                to={item.path}
                                className={`relative z-10 flex items-center py-4 font-medium transition-all duration-300
                                    ${active
                                        ? 'text-base-content translate-x-1 lg:rounded-none rounded-2xl'
                                        : 'text-neutral-content/60 hover:text-white hover:bg-white/5 rounded-2xl'
                                    }
                                    ${isCollapsed ? 'justify-center px-0' : 'pl-6 pr-4 gap-4'}
                                `}
                            >
                                <span className={`flex-shrink-0 ${active ? 'text-neutral scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && <span className="text-lg tracking-wide">{item.name}</span>}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-2 relative z-20 w-full">
                <div className="flex flex-col gap-1 mb-4">
                    <div className={`flex items-center gap-4 transition-all duration-200 p-3 rounded-2xl hover:bg-white/5 ${isCollapsed ? 'justify-center' : 'pl-6'}`}>
                        <div className="w-[22px] flex justify-center">
                            <ThemeController />
                        </div>
                        {!isCollapsed && <span className="text-neutral-content/60 font-medium text-lg">{t('common.theme')}</span>}
                    </div>

                    <div className="dropdown dropdown-top w-full">
                        <label tabIndex={0} className={`flex items-center gap-4 w-full cursor-pointer hover:bg-white/5 transition-all p-3 rounded-2xl ${isCollapsed ? 'justify-center' : 'pl-6'}`}>
                            <Languages size={22} className="text-neutral-content/60 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="text-neutral-content/60 font-medium text-lg">
                                    {languages.find(l => l.code === i18n.language)?.label || 'Language'}
                                </span>
                            )}
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[100] menu p-1 shadow-2xl bg-neutral border border-white/10 rounded-2xl w-40 mb-2">
                            {languages.map((lang) => {
                                const isSelected = i18n.language === lang.code;
                                return (
                                    <li key={lang.code}>
                                        <button
                                            onClick={() => i18n.changeLanguage(lang.code)}
                                            className={`rounded-xl py-3 px-4 transition-all duration-200 ${isSelected
                                                ? 'bg-white/20 text-white font-bold'
                                                : 'text-neutral-content/40 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="space-y-1">
                    {bottomItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center py-3 font-medium transition-all duration-200 text-neutral-content/60 hover:text-white hover:bg-white/5 rounded-2xl
                                ${isCollapsed ? 'justify-center' : 'pl-6 pr-4 gap-4'}`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {!isCollapsed && <span className="text-lg tracking-wide">{item.name}</span>}
                        </Link>
                    ))}

                    <button
                        onClick={() => authService.logout()}
                        className={`flex w-full items-center py-3 font-medium transition-all duration-200 text-error/80 hover:text-error hover:bg-error/10 rounded-2xl
                            ${isCollapsed ? 'justify-center' : 'pl-6 pr-4 gap-4'}`}
                    >
                        <LogOut size={22} className="flex-shrink-0" />
                        {!isCollapsed && <span className="text-lg tracking-wide">{t('dashboard_sidebar.logout')}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;