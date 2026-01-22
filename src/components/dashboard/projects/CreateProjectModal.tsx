import { useState, useEffect } from 'react';
import { X, FolderKanban, Loader2, Plus, Tag as TagIcon } from 'lucide-react';
import { NewProjectData, Tag } from '@/types';
import projectService from '@/services/projectService';
import { useTranslation } from 'react-i18next';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NewProjectData) => Promise<void>;
}

const CreateProjectModal = ({ isOpen, onClose, onSubmit }: CreateProjectModalProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Tag 相關狀態
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [showTagInput, setShowTagInput] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTags();
        }
    }, [isOpen]);

    const fetchTags = async () => {
        try {
            const tags = await projectService.getTags();
            setAvailableTags(tags);
        } catch (error) {
            console.error('Failed to fetch tags');
        }
    };

    const handleAddTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const newTag = await projectService.createTag({
                name: newTagName,
                color: '#88C0D0' // 預設 Nord 色
            });
            setAvailableTags([...availableTags, newTag]);
            setSelectedTagIds([...selectedTagIds, newTag.id]);
            setNewTagName('');
            setShowTagInput(false);
        } catch (error) {
            console.error('Failed to create tag');
        }
    };

    const toggleTag = (tagId: string) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                name,
                description,
                tag_ids: selectedTagIds
            });
            setName('');
            setDescription('');
            setSelectedTagIds([]);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-base-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-base-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FolderKanban className="text-neutral" />
                        {t('projects.create_new')}
                    </h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name & Description ... (保持原樣) */}
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-medium">{t('projects.project_name')}</span></label>
                        <input type="text" className="input input-bordered w-full rounded-full" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    {/* Tag Selection Section */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                                <TagIcon size={16} /> {t('projects.tags')}
                            </span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={`btn btn-xs rounded-full px-3 transition-all ${selectedTagIds.includes(tag.id)
                                            ? 'btn-neutral'
                                            : 'btn-outline border-base-300'
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                            {showTagInput ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        className="input input-xs input-bordered w-24 rounded-full"
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        autoFocus
                                    />
                                    <button type="button" onClick={handleAddTag} className="btn btn-xs btn-circle btn-neutral"><Plus size={12} /></button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowTagInput(true)}
                                    className="btn btn-xs btn-circle btn-ghost border border-dashed border-base-300"
                                >
                                    <Plus size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost rounded-full">{t('projects.cancel')}</button>
                        <button
                            type="submit"
                            className="btn btn-neutral text-base-100 rounded-full px-8"
                            disabled={loading || !name.trim() || selectedTagIds.length === 0}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('projects.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;