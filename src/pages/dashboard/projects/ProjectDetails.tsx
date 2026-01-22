import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, FolderKanban } from 'lucide-react';
import projectService from '@/services/projectService';
import handoutService from '@/services/handoutService';
import { Project, Handout, NewHandoutData } from '@/types';
import HandoutTable from '@/components/dashboard/handouts/HandoutTable';
import CreateHandoutModal from '@/components/dashboard/handouts/CreateHandoutModal';
import { useTranslation } from 'react-i18next';

const ProjectDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [handouts, setHandouts] = useState<Handout[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        if (!id) return;
        try {
            const [projectData, handoutsData] = await Promise.all([
                projectService.getProjectById(id),
                handoutService.getHandouts(id)
            ]);
            setProject(projectData);
            setHandouts(handoutsData);
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHandout = async (data: NewHandoutData) => {
        try {
            const newHandout = await handoutService.createHandout({
                ...data,
                project: id as string
            });
            setHandouts([newHandout, ...handouts]);
        } catch (error) {
            console.error('Failed to create handout:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!project) return <div>Project not found</div>;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/projects')} className="btn btn-circle btn-ghost">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                        <FolderKanban className="text-neutral" />
                        {project.name}
                    </h1>
                    <p className="text-base-content/60 mt-1">{project.description}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('handouts.title')}</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-neutral text-base-100 rounded-full gap-2 shadow-lg shadow-neutral/20"
                >
                    <Plus size={20} />
                    {t('handouts.create_new')}
                </button>
            </div>

            <HandoutTable handouts={handouts} />

            <CreateHandoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateHandout}
            />
        </div>
    );
};

export default ProjectDetails;