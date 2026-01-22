import { Tag } from '@/types';

interface TagFilterBarProps {
    tags: Tag[];
    selectedFilter: string;
    onSelect: (filter: string) => void;
}

const TagFilterBar = ({ tags, selectedFilter, onSelect }: TagFilterBarProps) => {
    const displayFilters = ['All', ...tags.slice(0, 5).map(tag => tag.name)];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide max-w-full">
            {displayFilters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onSelect(filter)}
                    className={`btn btn-sm rounded-full px-6 border-0 whitespace-nowrap transition-all duration-200 ${selectedFilter === filter
                            ? 'bg-neutral text-neutral-content hover:bg-neutral-focus'
                            : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default TagFilterBar;