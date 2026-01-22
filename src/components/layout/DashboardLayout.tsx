import { ReactNode, useState } from 'react';
import Sidebar from '@/components/dashboard/layout/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-base-200">
            <aside
                className={`hidden lg:block fixed h-full z-20 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
                    }`}
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            <main
                className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
                    }`}
            >
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;