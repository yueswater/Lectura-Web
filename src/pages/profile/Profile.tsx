import { useState, useEffect } from 'react';
import authService from '@/services/authService';
import { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AvatarCard from '@/components/profile/AvatarCard';
import InfoCard from '@/components/profile/InfoCard';

const Profile = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const data = await authService.getCurrentUser();
            setUser(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 pb-20">
            <Navbar onOpenSidebar={() => { }} />

            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-1/3">
                        <AvatarCard user={user} onUpdate={fetchProfile} />
                    </div>

                    <div className="w-full lg:w-2/3">
                        <InfoCard user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;