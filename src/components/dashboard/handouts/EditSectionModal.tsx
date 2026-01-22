import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Eye, Code as CodeIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Section } from '@/types';
import MarkdownToolbar from './MarkdownToolbar';
import { useTranslation } from 'react-i18next';

interface EditSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, data: { title: string; content: string; parent?: string | null }) => Promise<void>;
    section: Section | null;
    allSections: Section[];
}

const EditSectionModal = ({ isOpen, onClose, onSubmit, section, allSections }: EditSectionModalProps) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [parentId, setParentId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (section && isOpen) {
            setTitle(section.title);
            setContent(section.content || '');
            setParentId(section.parent || '');
        }
    }, [section, isOpen]);

    if (!isOpen || !section) return null;

    const eligibleParents = allSections.filter(s =>
        s.id !== section.id &&
        s.parent !== section.id &&
        s.level !== 'subsubsection'
    );

    const handleToolbarAction = (prefix: string, suffix: string) => {
        const el = textAreaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const fullText = el.value;
        const selectedText = fullText.substring(start, end);
        const before = fullText.substring(0, start);
        const after = fullText.substring(end);

        const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
        setContent(newText);

        setTimeout(() => {
            el.focus();
            const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
            el.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(section.id, {
                title,
                content,
                parent: parentId || null
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-7xl h-[90vh] bg-base-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-100 z-10 gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                        <h3 className="text-lg font-bold text-base-content/70 shrink-0">{t('section.edit.editing')}</h3>
                        <input
                            type="text"
                            className="input input-bordered input-sm w-full font-bold text-base-content"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Section Title"
                        />
                        <select
                            className="select select-bordered select-sm w-full md:w-64 shrink-0"
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                        >
                            <option value="">{t('section.no_parent')}</option>
                            {eligibleParents.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.level === 'section' ? '' : '↳ '} {s.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button onClick={onClose} className="btn btn-ghost btn-sm">{t('section.cancel')}</button>
                        <button
                            onClick={handleSubmit}
                            className="btn btn-accent btn-sm text-white gap-2 rounded-full"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {t('section.edit.save')}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className={`flex-1 flex flex-col border-r border-base-200 ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="bg-base-200/50 px-4 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
                            <CodeIcon size={14} /> {t('section.edit.markdown_source')}
                        </div>
                        <MarkdownToolbar onAction={handleToolbarAction} />
                        <textarea
                            ref={textAreaRef}
                            className="flex-1 p-6 bg-base-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t('section.edit.placeholder')}
                        />
                    </div>

                    <div className={`flex-1 flex flex-col bg-base-50/50 ${activeTab === 'write' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="bg-base-200/50 px-4 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={14} /> {t('section.edit.preview')}
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto bg-white">
                            <article className="prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-pre:bg-base-300 prose-pre:text-base-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {content}
                                </ReactMarkdown>
                            </article>
                        </div>
                    </div>
                </div>

                <div className="md:hidden border-t border-base-200 p-2 flex">
                    <button
                        className={`flex-1 btn btn-sm ${activeTab === 'write' ? 'btn-neutral' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('write')}
                    >
                        Write
                    </button>
                    <button
                        className={`flex-1 btn btn-sm ${activeTab === 'preview' ? 'btn-neutral' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSectionModal;