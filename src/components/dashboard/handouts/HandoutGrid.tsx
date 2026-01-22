import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Handout } from '@/types';
import HandoutCard from './HandoutCard';
import { useTranslation } from 'react-i18next';

interface HandoutGridProps {
    handouts: Handout[];
    itemsPerPage?: number;
    columns?: string;
}

const HandoutGrid = ({ handouts, itemsPerPage = 6, columns = "md:grid-cols-2 lg:grid-cols-3" }: HandoutGridProps) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(handouts.length / itemsPerPage);

    const currentHandouts = handouts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    if (handouts.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-base-content/30 bg-base-200/20 rounded-[2rem] border border-dashed border-base-200">
                <BookOpen size={48} className="mb-4 opacity-20" />
                <p>{t('handouts.no_handouts')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className={`grid grid-cols-1 ${columns} gap-6`}>
                {currentHandouts.map((handout) => (
                    <HandoutCard key={handout.id} data={handout} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-xs font-bold tracking-widest uppercase opacity-50">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HandoutGrid;