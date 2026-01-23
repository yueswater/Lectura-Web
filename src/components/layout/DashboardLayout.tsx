import { ReactNode, useState } from 'react';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-base-200 relative">
            {/* Mobile Header - Only visible on small screens */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-base-100 border-b border-base-300 z-30 flex items-center px-4 justify-between">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="btn btn-ghost btn-sm btn-square"
                >
                    <Menu size={20} />
                </button>
                <span className="font-bold text-lg opacity-50 italic">Lectura</span>
                <div className="w-8" /> {/* Placeholder for balance */}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[40] lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar - Desktop & Mobile Logic */}
            <aside
                className={`fixed h-full z-[50] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} 
                    w-72 bg-base-100 shadow-xl lg:shadow-none`}
            >
                {/* Mobile Close Button */}
                <div className="lg:hidden absolute top-4 right-4 z-[60]">
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="btn btn-ghost btn-xs btn-circle"
                    >
                        <X size={18} />
                    </button>
                </div>

                <Sidebar
                    isCollapsed={isCollapsed}
                    toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 p-4 md:p-8 mt-16 lg:mt-0 overflow-y-auto transition-all duration-300 ease-in-out 
                    ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
            >
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;