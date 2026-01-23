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

    const formatFileSize = (bytes?: string | number) => {
        if (!bytes) return '0 KB';
        const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
        if (isNaN(numBytes) || numBytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(numBytes) / Math.log(k));
        return parseFloat((numBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return '1d ago';
        return `${diffDays}d ago`;
    };

    return (
        <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200 mt-6">
            <div className="flex flex-col gap-1">
                {files.slice(0, 5).map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-200/50 transition-all group cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-xl bg-base-200 flex-shrink-0 flex items-center justify-center">
                            {getIcon(file.file_type)}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {/* Title - Single line with ellipsis */}
                            <h4 className="text-sm font-bold text-base-content truncate mb-0.5">
                                {file.title}
                            </h4>

                            {/* Info Line - Horizontal flex with no wrap */}
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-base-content/40 whitespace-nowrap overflow-hidden">
                                <span>{formatFileSize(file.file_size)}</span>
                                <span className="opacity-30">•</span>
                                <span>{formatDate(file.created_at)}</span>
                            </div>
                        </div>

                        <button className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
                {files.length === 0 && (
                    <div className="text-center py-6 text-base-content/40 text-sm font-medium italic">
                        {t('common.no_files')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentFiles;