import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, BookOpen } from 'lucide-react';
import handoutService from '@/services/handoutService';
import projectService from '@/services/projectService';
import { Handout, NewHandoutData, Tag } from '@/types';
import HandoutGrid from '@/components/dashboard/handouts/HandoutGrid';
import CreateHandoutModal from '@/components/dashboard/handouts/CreateHandoutModal';
import TagDropdown from '@/components/dashboard/tags/TagDropdown';
import { useTranslation } from 'react-i18next';

const Handouts = () => {
    const { t } = useTranslation();
    const [handouts, setHandouts] = useState<Handout[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [handoutsData, tagsData] = await Promise.all([
                    handoutService.getHandouts(),
                    projectService.getTags()
                ]);
                setHandouts(handoutsData);
                setTags(tagsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateHandout = async (data: NewHandoutData) => {
        try {
            const newHandout = await handoutService.createHandout(data);
            setHandouts([newHandout, ...handouts]);
        } catch (error) {
            console.error('Failed to create handout:', error);
            throw error;
        }
    };

    const filteredHandouts = handouts.filter(handout => {
        const matchesSearch = handout.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || handout.subject === filterType;
        return matchesSearch && matchesFilter;
    });

    const displayFilters = ['All', ...tags.slice(0, 5).map(tag => tag.name)];

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-neutral/90" />
                        {t('handouts.title')}
                    </h1>
                    <p className="text-base-content/60 mt-1">{t('handouts.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-neutral text-base-100 rounded-full gap-2 shadow-lg shadow-neutral/20"
                >
                    <Plus size={20} />
                    {t('handouts.create_new')}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-base-100 p-4 rounded-3xl shadow-sm border border-base-200">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input
                        type="text"
                        placeholder={t('handouts.search_placeholder')}
                        className="input input-bordered w-full pl-10 rounded-full bg-base-200/30 border-none focus:bg-base-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                    <div className="flex gap-2 mr-2">
                        {displayFilters.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`btn btn-sm rounded-full px-6 transition-all duration-300 ${filterType === type
                                    ? 'btn-neutral text-white'
                                    : 'btn-ghost bg-base-200/50 hover:bg-base-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <TagDropdown
                        tags={tags}
                        selectedTag={filterType}
                        onSelect={setFilterType}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                </div>
            ) : (
                <HandoutGrid
                    handouts={filteredHandouts}
                    itemsPerPage={15}
                    columns="md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                />
            )}

            <CreateHandoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateHandout}
            />
        </div>
    );
};

export default Handouts;