import { FileText, Image, FileCode, MoreHorizontal, FileDigit } from 'lucide-react';
import { Handout } from '@/types';
import { useTranslation } from 'react-i18next';

interface RecentFilesProps {
    files: Handout[];
}

const RecentFiles = ({ files }: RecentFilesProps) => {
    const { t } = useTranslation();
    const getIcon = (type?: string) => {
        switch (type) {
            case 'pdf': return <FileDigit className="text-error" />;
            case 'doc': return <FileText className="text-primary" />;
            case 'img': return <Image className="text-accent" />;
            case 'code': return <FileCode className="text-neutral" />;
            default: return <FileText className="text-base-content/50" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };

    return (
        <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200 mt-6">
            <div className="flex flex-col gap-2">
                {files.slice(0, 5).map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-base-200/50 transition-colors group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                            {getIcon(file.file_type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-base-content truncate">{file.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-base-content/60">
                                <span>{file.file_size || '1.2 MB'}</span>
                                <span>•</span>
                                <span>{formatDate(file.created_at)}</span>
                            </div>
                        </div>

                        <button className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
                {files.length === 0 && (
                    <div className="text-center py-4 text-base-content/50 text-sm">
                        {t('common.no_files')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentFiles;