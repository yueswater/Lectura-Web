import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Calendar, Clock, ChevronRight, Tag as TagIcon, Download } from 'lucide-react';
import { Project } from '@/types';
import { useTranslation } from 'react-i18next';
import projectService from '@/services/projectService';
import Overlay from '@/components/common/Overlay';

interface ProjectCardProps {
    data: Project;
}

const ProjectCard = ({ data }: ProjectCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isDownloading, setIsDownloading] = useState(false);

    const dateObj = new Date(data.created_at);
    const monthKey = dateObj.getMonth().toString();
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const translatedDate = `${t(`calendar.months.${monthKey}`)} ${day}, ${year}`;

    const sortedTags = data.tags && data.tags.length > 0
        ? [...data.tags].sort((a, b) => a.id.localeCompare(b.id))
        : [];

    const handleDownloadZip = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDownloading(true);
        try {
            const blob = await projectService.downloadProjectZip(data.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            link.setAttribute('download', `${data.name}_${timestamp}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        } finally {
            // Slight delay so the user sees the completion
            setTimeout(() => setIsDownloading(false), 500);
        }
    };

    return (
        <>
            <div
                onClick={() => navigate(`/projects/${data.id}`)}
                className="group relative bg-base-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 border border-base-200 h-full cursor-pointer hover:-translate-y-1.5 flex flex-col"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-neutral/5 text-neutral rounded-2xl flex items-center justify-center transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                        <FolderKanban size={24} />
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={handleDownloadZip}
                            className="p-2 bg-base-200 text-base-content/70 hover:bg-accent hover:text-white rounded-full transition-all duration-200 z-10"
                        >
                            <Download size={16} />
                        </button>
                        <div className="p-2 bg-accent/10 text-accent rounded-full">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col gap-3 mb-4">
                        <h3 className="text-xl font-bold text-base-content group-hover:text-accent transition-colors">
                            {data.name}
                        </h3>
                        {sortedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {sortedTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.2 border transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: `${tag.color}15`,
                                            color: tag.color,
                                            borderColor: `${tag.color}30`
                                        }}
                                    >
                                        <TagIcon size={10} className="mr-1" />
                                        {tag.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-base-content/50 text-sm leading-relaxed line-clamp-2">
                        {data.description || t('projects.no_description')}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-base-content/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/40">
                            <Calendar size={14} className="text-base-content/30" />
                            <span>{translatedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/40">
                            <Clock size={14} className="text-base-content/30" />
                            <span>{t('common.recent')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Overlay show={isDownloading}>
                <div className="bg-base-100/60 p-8 rounded-[2.5rem] shadow-2xl border border-white/20 backdrop-blur-2xl flex flex-col items-center gap-6 min-w-[300px]">
                    <div className="relative">
                        <span className="loading loading-spinner w-12 text-accent"></span>
                        <Download size={20} className="absolute inset-0 m-auto text-accent/50" />
                    </div>
                    <div className="text-center">
                        <p className="font-black text-xl tracking-tighter text-base-content">LECTURA</p>
                        <p className="text-sm font-medium text-base-content/60">{t('common.download.project_downloading')}</p>
                    </div>
                </div>
            </Overlay>
        </>
    );
};

export default ProjectCard;