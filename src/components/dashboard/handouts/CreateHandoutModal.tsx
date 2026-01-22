import { useState, useEffect } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { NewHandoutData, Project } from '@/types';
import projectService from '@/services/projectService';
import { useTranslation } from 'react-i18next';

interface CreateHandoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NewHandoutData) => Promise<void>;
}

const CreateHandoutModal = ({ isOpen, onClose, onSubmit }: CreateHandoutModalProps) => {
    const {t} = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(true);

    // Fetch projects when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchProjects = async () => {
                setProjectsLoading(true);
                try {
                    const data = await projectService.getProjects();
                    setProjects(data);
                    // Auto-select the first project if available
                    if (data.length > 0) {
                        setProjectId(data[0].id);
                    }
                } catch (error) {
                    console.error('Failed to fetch projects for dropdown:', error);
                } finally {
                    setProjectsLoading(false);
                }
            };
            fetchProjects();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) return; // Prevent submission without project

        setLoading(true);
        try {
            await onSubmit({
                title,
                description,
                project: projectId,
                yaml_config: "theme: nordic_dark"
            });
            setTitle('');
            setDescription('');
            // Keep the last selected project or reset, depending on UX preference. 
            // Resetting might be safer:
            if (projects.length > 0) setProjectId(projects[0].id);
            onClose();
        } catch (error) {
            console.error('Error creating handout:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-base-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="text-neutral/90" />
                        {t('handouts.create_new')}
                    </h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">{t('handouts.select_project')}</span>
                        </label>
                        {projectsLoading ? (
                            <div className="h-12 w-full bg-base-200 rounded-xl animate-pulse"></div>
                        ) : (
                            <select
                                className="select select-bordered w-full rounded-full focus:select-accent"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                required
                            >
                                <option value="" disabled>{t('handouts.select_project')}</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        )}
                        {projects.length === 0 && !projectsLoading && (
                            <label className="label">
                                <span className="label-text-alt text-error">You must create a project first.</span>
                            </label>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">{t('handouts.handout_title')}</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('handouts.handout_title')}
                            className="input input-bordered w-full rounded-full focus:input-accent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">{t('handouts.handout_description')}</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24 rounded-2xl focus:textarea-accent"
                            placeholder={t('handouts.handout_description_placeholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost rounded-full"
                            disabled={loading}
                        >
                            {t('handouts.cancel_create')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-accent text-base-100 rounded-full px-8"
                            disabled={loading || !title.trim() || !projectId}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                t('handouts.create_handout')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateHandoutModal;