import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, FolderKanban } from 'lucide-react';
import projectService from '@/services/projectService';
import { Project, NewProjectData } from '@/types';
import CreateProjectModal from '@/components/dashboard/projects/CreateProjectModal';
import ProjectCard from '@/components/dashboard/projects/ProjectCard';
import { useTranslation } from 'react-i18next';

const Projects = () => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (data: NewProjectData) => {
        try {
            const newProject = await projectService.createProject(data);
            setProjects([newProject, ...projects]);
        } catch (error) {
            console.error('Failed to create project:', error);
            throw error; // Re-throw to let the modal handle the loading state
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                        <FolderKanban className="w-8 h-8 text-neutral" />
                        {t('projects.title')}
                    </h1>
                    <p className="text-base-content/60 mt-1">{t('projects.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-neutral text-neutral-content rounded-full gap-2 shadow-lg shadow-neutral/20"
                >
                    <Plus size={20} />
                    {t('projects.create_new')}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input
                        type="text"
                        placeholder={t('projects.search_placeholder')}
                        className="input input-bordered w-full pl-10 bg-base-100 rounded-full focus:outline-none focus:border-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-info" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <ProjectCard key={project.id} data={project} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-base-content/50 bg-base-100 rounded-3xl border border-dashed border-base-300">
                            <FolderKanban className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">{t('projects.no_projects')}</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn btn-link no-underline text-neutral"
                            >
                                {t('projects.create_new')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </div>
    );
};

export default Projects;