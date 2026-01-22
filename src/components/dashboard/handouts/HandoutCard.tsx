import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Code, FileDigit, Calendar, Clock, ChevronRight, Tag as TagIcon } from 'lucide-react';
import { Handout } from '@/types';
import { useTranslation } from 'react-i18next';

interface HandoutCardProps {
    data: Handout;
}

const HandoutCard = ({ data }: HandoutCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getIcon = () => {
        switch (data.file_type) {
            case 'pdf': return <FileDigit size={24} />;
            case 'doc': return <FileText size={24} />;
            case 'code': return <Code size={24} />;
            default: return <BookOpen size={24} />;
        }
    };

    const dateObj = new Date(data.created_at);
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    return (
        <div
            onClick={() => navigate(`/handouts/${data.id}`)}
            className="group relative bg-base-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 border border-base-200 aspect-square cursor-pointer hover:-translate-y-1.5 flex flex-col justify-between"
        >
            <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-neutral/5 text-neutral rounded-[1.25rem] flex items-center justify-center transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    {getIcon()}
                </div>
                <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <div className="p-2 bg-accent/10 text-accent rounded-full">
                        <ChevronRight size={18} />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-base-content group-hover:text-accent transition-colors line-clamp-1">
                        {data.title}
                    </h3>
                    {data.subject && (
                        <div className="flex">
                            <div
                                className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase flex items-center border transition-all group-hover:border-accent/30 group-hover:bg-accent/5 group-hover:text-accent bg-base-200/50 text-base-content/60 border-base-300"
                            >
                                <TagIcon size={10} className="mr-1" />
                                {data.subject}
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-sm text-base-content/50 line-clamp-2 leading-relaxed">
                    {data.description || t('handouts.no_description')}
                </p>
            </div>

            <div className="pt-4 border-t border-base-content/5 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-base-content/40 uppercase tracking-tight">
                    <Calendar size={12} className="text-base-content/30" />
                    <span>{`${year}/${dateObj.getMonth() + 1}/${day}`}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-base-content/40 uppercase tracking-tight">
                    <Clock size={12} className="text-base-content/30" />
                    <span>{t('common.recent')}</span>
                </div>
            </div>
        </div>
    );
};

export default HandoutCard;