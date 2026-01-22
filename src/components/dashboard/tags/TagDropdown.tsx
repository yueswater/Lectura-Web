import { useState, useRef, useEffect } from 'react';
import { Filter, Check } from 'lucide-react';
import { Tag } from '@/types';
import { useTranslation } from 'react-i18next';

interface TagDropdownProps {
    tags: Tag[];
    selectedTag: string;
    onSelect: (tagName: string) => void;
}

const TagDropdown = ({ tags, selectedTag, onSelect }: TagDropdownProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`btn btn-sm btn-square rounded-full transition-all ${isOpen ? 'btn-neutral' : 'btn-ghost border border-base-300'
                    }`}
            >
                <Filter size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 z-[100] w-52 bg-base-100 rounded-2xl shadow-2xl border border-base-200 py-2 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-2 text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
                        {t('projects.tags')}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        <button
                            onClick={() => { onSelect('All'); setIsOpen(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-base-200 flex items-center justify-between"
                        >
                            <span>{t('common.all')}</span>
                            {selectedTag === 'All' && <Check size={14} className="text-accent" />}
                        </button>
                        <div className="divider my-0 opacity-50"></div>
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => { onSelect(tag.name); setIsOpen(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-base-200 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
                                    <span className="truncate max-w-[120px]">{tag.name}</span>
                                </div>
                                {selectedTag === tag.name && <Check size={14} className="text-accent" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagDropdown;