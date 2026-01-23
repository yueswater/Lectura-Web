import { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import handoutService from '@/services/handoutService';
import authService from '@/services/authService';
import projectService from '@/services/projectService';
import { Handout, UserProfile, Tag, Project } from '@/types';
import HandoutGrid from '@/components/dashboard/handouts/HandoutGrid';
import DashboardCalendar from '@/components/dashboard/widgets/DashboardCalendar';
import RecentFiles from '@/components/dashboard/widgets/RecentFiles';
import TagCloud from '@/components/dashboard/widgets/TagCloud';
import TagFilterBar from '@/components/dashboard/tags/TagFilterBar';
import FuzzySearch from '@/components/common/FuzzySearch';
import { useTranslation } from 'react-i18next';
import StorageWidget from '@/components/dashboard/widgets/StorageWidget';

const Dashboard = () => {
    const { t } = useTranslation();
    const [handouts, setHandouts] = useState<Handout[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterType, setFilterType] = useState<string>('All');
    const [searchResults, setSearchResults] = useState<Handout[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [handoutsData, userData, tagsData, projectsData] = await Promise.all([
                    handoutService.getHandouts(),
                    authService.getCurrentUser(),
                    projectService.getTags(),
                    projectService.getProjects()
                ]);
                setHandouts(handoutsData);
                setUser(userData);
                setTags(tagsData);
                setProjects(projectsData);
                setSearchResults(handoutsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredHandouts = filterType === 'All'
        ? handouts
        : handouts.filter(h => {
            const project = projects.find(p => p.id === h.project);
            return project?.tags.some(tag => tag.name === filterType);
        });

    return (
        <div className="max-w-[1600px] mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-base-content">{t('dashboard.title')}</h1>
                    <p className="text-base-content/60 mt-2 text-lg">
                        {t('dashboard.welcome_back')}, {user?.username || 'Administrator'}
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <FuzzySearch
                        data={handouts}
                        keys={['title', 'description', 'subject']}
                        onResult={setSearchResults}
                        placeholder={t('common.search_placeholder')}
                        className="flex-1 md:w-72"
                    />
                    <button className="btn btn-circle btn-md bg-base-100 border-transparent shadow-sm hover:bg-white hover:shadow-md min-h-0 h-12 w-12">
                        <Bell className="w-5 h-5 text-base-content/70" />
                    </button>
                    <div className="avatar ml-1">
                        <div className="w-12 h-12 rounded-full ring-offset-2 ring-offset-base-100 cursor-pointer overflow-hidden">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0D0D0D&color=fff`}
                                alt={user?.username || 'User'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 space-y-8">
                    <div className="bg-base-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-base-content">{t('dashboard.recent_handouts')}</h2>
                            <TagFilterBar
                                tags={tags}
                                selectedFilter={filterType}
                                onSelect={setFilterType}
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-10 h-10 animate-spin text-info" />
                            </div>
                        ) : (
                            <HandoutGrid
                                handouts={searchResults.filter(sh => filteredHandouts.some(fh => fh.id === sh.id))}
                            />
                        )}

                        <div className="mt-8 flex justify-center">
                            <button className="btn btn-ghost text-base-content/50 hover:text-base-content">
                                {t('common.see_all')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TagCloud tags={tags} handouts={handouts} />
                        <StorageWidget user={user} files={handouts} />
                    </div>
                </div>

                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-base-100 rounded-[2.5rem] p-8 shadow-sm h-full">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-6">{t('calendar.title')}</h3>
                            <DashboardCalendar handouts={handouts} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{t('dashboard.recent_files')}</h3>
                                <button className="text-sm text-accent font-medium">{t('common.see_all')}</button>
                            </div>
                            <RecentFiles files={handouts} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;