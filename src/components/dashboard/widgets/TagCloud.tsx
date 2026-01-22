import { useTranslation } from 'react-i18next';
import { Tag, Handout } from '@/types';
import { MoreHorizontal } from 'lucide-react';

interface TagCloudProps {
    tags: Tag[];
    handouts: Handout[];
}

const TagCloud = ({ tags, handouts }: TagCloudProps) => {
    const { t } = useTranslation();

    const getTagSize = (tagName: string) => {
        const count = handouts.filter(h => h.subject === tagName).length;
        if (count === 0) return 'text-xs opacity-40';
        if (count < 3) return 'text-sm opacity-60';
        if (count < 6) return 'text-base font-medium opacity-80';
        if (count < 10) return 'text-lg font-bold';
        return 'text-2xl font-black text-accent';
    };

    return (
        <div className="bg-base-100 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('dashboard.stats.title')}</h3>
                <button className="btn btn-circle btn-sm btn-ghost">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <div className="flex-grow flex flex-wrap items-center justify-center gap-x-4 gap-y-2 overflow-hidden py-4">
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <span
                            key={tag.id}
                            className={`transition-all duration-300 cursor-default hover:text-accent ${getTagSize(tag.name)}`}
                            style={{ color: getTagSize(tag.name).includes('text-accent') ? undefined : tag.color }}
                        >
                            {tag.name}
                        </span>
                    ))
                ) : (
                    <p className="text-base-content/30 text-sm">No tags available</p>
                )}
            </div>
        </div>
    );
};

export default TagCloud;