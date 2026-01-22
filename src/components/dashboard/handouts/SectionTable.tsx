import { useMemo } from 'react';
import { Edit2, ChevronRight, CornerDownRight, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Section } from '@/types';
import { useTranslation } from 'react-i18next';

interface SectionTableProps {
    sections: Section[];
    onDelete?: (id: string) => void;
    onEdit?: (section: Section) => void; // New Prop
    onUpdateSections?: (newSections: Section[]) => void;
}

interface FlattenedSection extends Section {
    depth: number;
}

const SectionTable = ({ sections, onDelete, onEdit, onUpdateSections }: SectionTableProps) => {
    const { t } = useTranslation();
    const sortedFlattenedSections = useMemo(() => {
        const buildTree = (parentId: string | null, depth: number): FlattenedSection[] => {
            const children = sections
                .filter(s => s.parent === parentId)
                .sort((a, b) => a.order - b.order);

            return children.flatMap(child => [
                { ...child, depth },
                ...buildTree(child.id, depth + 1)
            ]);
        };
        return buildTree(null, 0);
    }, [sections]);

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (!onUpdateSections) return;
        const current = sortedFlattenedSections[index];
        const siblings = sortedFlattenedSections.filter(s => s.parent === current.parent);
        const currentIndexInSiblings = siblings.findIndex(s => s.id === current.id);

        if (direction === 'up' && currentIndexInSiblings > 0) {
            swapOrder(current, siblings[currentIndexInSiblings - 1]);
        } else if (direction === 'down' && currentIndexInSiblings < siblings.length - 1) {
            swapOrder(current, siblings[currentIndexInSiblings + 1]);
        }
    };

    const swapOrder = (itemA: Section, itemB: Section) => {
        if (!onUpdateSections) return;
        const newSections = sections.map(s => {
            if (s.id === itemA.id) return { ...s, order: itemB.order };
            if (s.id === itemB.id) return { ...s, order: itemA.order };
            return s;
        });
        onUpdateSections(newSections);
    };

    const getLevelStyle = (level: string) => {
        switch (level) {
            case 'section': return { badge: 'badge-neutral', label: 'H2' };
            case 'subsection': return { badge: 'badge-info badge-outline', label: 'H3' };
            case 'subsubsection': return { badge: 'badge-accent badge-outline', label: 'H4' };
            default: return { badge: 'badge-ghost', label: '?' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="overflow-x-auto bg-base-100 rounded-3xl shadow-sm border border-base-200">
            <table className="table table-lg">
                <thead>
                    <tr className="bg-base-200/50 text-base-content/70">
                        <th className="w-24 text-center">{t('section_table.move')}</th>
                        <th>{t('section_table.section_structure')}</th>
                        <th>{t('section_table.type')}</th>
                        <th>{t('section_table.last_updated')}</th>
                        <th className="text-right">{t('section_table.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFlattenedSections.length > 0 ? (
                        sortedFlattenedSections.map((section, index) => {
                            const style = getLevelStyle(section.level);
                            const paddingLeft = section.depth * 2.5 + 1;

                            return (
                                <tr key={section.id} className="hover:bg-base-200/30 transition-colors group">
                                    <td>
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="btn btn-xs btn-ghost btn-square" onClick={() => handleMove(index, 'up')}>
                                                <ArrowUp size={14} />
                                            </button>
                                            <button className="btn btn-xs btn-ghost btn-square" onClick={() => handleMove(index, 'down')}>
                                                <ArrowDown size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center" style={{ paddingLeft: `${paddingLeft}rem` }}>
                                            {section.depth > 0 && (
                                                section.depth === 1
                                                    ? <CornerDownRight size={16} className="mr-2 text-base-content/40" />
                                                    : <ChevronRight size={16} className="mr-2 text-base-content/40" />
                                            )}
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold ${section.level === 'section' ? 'text-base-content' : 'text-base-content/80'}`}>
                                                    {section.title}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge ${style.badge} badge-sm font-mono`}>{style.label}</div>
                                    </td>
                                    <td className="opacity-70 text-sm">
                                        {formatDate(section.updated_at)}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="btn btn-ghost btn-circle btn-sm"
                                                onClick={() => onEdit && onEdit(section)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                                                onClick={() => onDelete && onDelete(section.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2 text-base-content/50">
                                    <span className="text-lg font-medium">{t('handouts.empty')}</span>
                                    <span className="text-sm">{t('handouts.no_section')}</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SectionTable;