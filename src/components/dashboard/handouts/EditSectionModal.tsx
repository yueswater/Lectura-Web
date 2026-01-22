import { useState, useEffect, useRef, useCallback } from 'react';
import { Save, Loader2, Code as CodeIcon } from 'lucide-react';
import { Section } from '@/types';
import MarkdownToolbar from './MarkdownToolbar';
import SelectionToolbar from '../widgets/SelectionToolbar';
import MarkdownPreview from '../widgets/MarkdownPreview';
import { useTranslation } from 'react-i18next';
import { ListSequencer } from '@/utils/ListSequencer';

interface EditSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, data: { title: string; content: string; parent?: string | null }) => Promise<void>;
    section: Section | null;
    allSections: Section[];
    autoSaveInterval?: number;
}

const EditSectionModal = ({ isOpen, onClose, onSubmit, section, autoSaveInterval = 60000 }: EditSectionModalProps) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [parentId, setParentId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showSavedStatus, setShowSavedStatus] = useState(false);
    const [selection, setSelection] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
    const [hexColor, setHexColor] = useState('#ff0000');

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = useCallback(async () => {
        if (!section || loading) return;
        setLoading(true);
        try {
            await onSubmit(section.id, { title, content, parent: parentId || null });
            setShowSavedStatus(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [section, title, content, parentId, onSubmit, loading]);

    const handleClose = useCallback(async () => {
        await handleSave();
        onClose();
    }, [handleSave, onClose]);

    useEffect(() => {
        if (showSavedStatus) {
            const timer = setTimeout(() => setShowSavedStatus(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSavedStatus]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                handleClose();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [handleSave, handleClose, isOpen]);

    useEffect(() => {
        if (!isOpen || !section) return;
        const timer = setInterval(() => { handleSave(); }, autoSaveInterval);
        return () => clearInterval(timer);
    }, [isOpen, section, handleSave, autoSaveInterval]);

    const handleSelect = () => {
        const el = textAreaRef.current;
        if (!el) return;
        if (el.selectionStart !== el.selectionEnd) {
            const { offsetLeft, offsetTop } = el;
            setSelection({ visible: true, x: offsetLeft + 20, y: offsetTop + 50 });
        } else {
            setSelection(prev => ({ ...prev, visible: false }));
        }
    };

    const applyFormat = (prefix: string, suffix: string) => {
        const el = textAreaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = content.substring(start, end);
        const newText = content.substring(0, start) + prefix + selected + suffix + content.substring(end);
        setContent(newText);
        setSelection(prev => ({ ...prev, visible: false }));
        setTimeout(() => {
            el.focus();
            const newPos = start + prefix.length + selected.length + suffix.length;
            el.setSelectionRange(newPos, newPos);
        }, 0);
    };

    useEffect(() => {
        if (section && isOpen) {
            setTitle(section.title);
            setContent(section.content || '');
            setParentId(section.parent || '');
            setShowSavedStatus(false);
        }
    }, [section, isOpen]);

    const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            const el = e.currentTarget;
            const start = el.selectionStart;
            const text = el.value;
            const lastNewLine = text.lastIndexOf('\n', start - 1);
            const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
            const currentLine = text.substring(lineStart, start);
            const listRegex = /^(\s*(-|\*|\+|\d+\.|[a-zA-Z]+\.|[甲-癸]+\.|[ivxIVX]+\.)\s+)/;
            const match = currentLine.match(listRegex);

            if (match) {
                e.preventDefault();
                const fullPrefix = match[1];
                const marker = match[2];
                if (currentLine.trim() === marker.trim() || currentLine.trim() === fullPrefix.trim()) {
                    const before = text.substring(0, lineStart);
                    const after = text.substring(start);
                    setContent(before + '\n' + after);
                    setTimeout(() => el.setSelectionRange(lineStart + 1, lineStart + 1), 0);
                } else {
                    const nextMarker = ListSequencer.getNext(marker);
                    const nextPrefix = fullPrefix.replace(marker, nextMarker);
                    const before = text.substring(0, start);
                    const after = text.substring(start);
                    setContent(before + '\n' + nextPrefix + after);
                    setTimeout(() => {
                        const newPos = start + nextPrefix.length + 1;
                        el.setSelectionRange(newPos, newPos);
                    }, 0);
                }
            }
        }
    };

    if (!isOpen || !section) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative w-full max-w-7xl h-[90vh] bg-base-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                <SelectionToolbar
                    visible={selection.visible}
                    x={selection.x}
                    y={selection.y}
                    hexColor={hexColor}
                    onColorChange={setHexColor}
                    onApplyFormat={applyFormat}
                    onClose={() => setSelection(prev => ({ ...prev, visible: false }))}
                />

                <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-100 z-10 gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                        <h3 className="text-lg font-bold text-base-content/70 shrink-0">{t('section.edit.editing').toUpperCase()}</h3>
                        <input
                            type="text"
                            className="input input-bordered input-sm w-full font-bold text-base-content"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="min-w-[100px] flex justify-start items-center">
                            {showSavedStatus && (
                                <span className="text-xs text-accent font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                    {t('section.edit.saved')}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={handleClose} className="btn btn-ghost btn-sm">{t('section.cancel').toUpperCase()}</button>
                        <button
                            onClick={handleSave}
                            className="btn btn-accent btn-sm text-white gap-2 rounded-full px-6"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {t('section.edit.save').toUpperCase()}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col border-r border-base-200">
                        <div className="bg-base-200/50 px-4 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
                            <CodeIcon size={14} /> {t('section.edit.markdown_source')}
                        </div>
                        <MarkdownToolbar onAction={applyFormat} />
                        <textarea
                            ref={textAreaRef}
                            className="flex-1 p-6 bg-base-100 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                            value={content}
                            onSelect={handleSelect}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={handleEditorKeyDown}
                            placeholder={t('section.edit.placeholder')}
                        />
                    </div>
                    <MarkdownPreview content={content} />
                </div>
            </div>
        </div>
    );
};

export default EditSectionModal;