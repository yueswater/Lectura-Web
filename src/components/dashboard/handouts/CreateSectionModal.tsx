import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { NewSectionData, Section } from '@/types';
import { useTranslation } from 'react-i18next';

interface CreateSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NewSectionData) => Promise<void>;
    handoutId: string;
    existingSections: Section[];
}

const CreateSectionModal = ({ isOpen, onClose, onSubmit, handoutId, existingSections }: CreateSectionModalProps) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [parentId, setParentId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: NewSectionData = {
                handout: handoutId,
                title,
                content: '', // FIX: Send empty string for required content field
                parent: parentId || undefined
            };
            await onSubmit(payload);
            setTitle('');
            setParentId('');
            onClose();
        } catch (error) {
            console.error('Error creating section:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter out Subsubsections from parent options (since max depth is usually H4)
    const eligibleParents = existingSections.filter(s => s.level !== 'subsubsection');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-base-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-base-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Plus className="text-accent" />
                        {t('section.title')}
                    </h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">{t('section.section_title')}</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('section.example')}
                            className="input input-bordered w-full rounded-xl focus:input-accent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">{t('section.parent_section')}</span>
                            <span className="label-text-alt text-base-content/50">{t('section.empty')}</span>
                        </label>
                        <select
                            className="select select-bordered w-full rounded-xl focus:select-accent"
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                        >
                            <option value="">{t('section.no_parent')}</option>
                            {eligibleParents.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.level === 'section' ? '' : '-- '} {s.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost rounded-xl"
                            disabled={loading}
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-accent text-white rounded-xl px-8"
                            disabled={loading || !title.trim()}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                t('section.add_new_section')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSectionModal;