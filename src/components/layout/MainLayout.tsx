import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ProfileSidebar from './ProfileSidebar';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-base-100 overflow-x-hidden">
            <div
                className={`relative min-h-screen transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top-left will-change-transform ${isSidebarOpen
                    ? 'scale-[0.98] -translate-x-2'
                    : 'scale-100 translate-x-0'
                    }`}
            >
                <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main>
                    <Outlet />
                </main>
            </div>

            <div
                className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${isSidebarOpen
                    ? 'opacity-100 pointer-events-auto backdrop-blur-xl bg-base-100/60'
                    : 'opacity-0 pointer-events-none backdrop-blur-none bg-transparent'
                    }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <ProfileSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </div>
    );
};

export default MainLayout;