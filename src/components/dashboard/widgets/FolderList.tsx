import { FileText, Image, FileCode, MoreHorizontal } from 'lucide-react';

const RecentFiles = () => {
    const files = [
        { name: 'Syllabus_2026.pdf', size: '2.4 MB', type: 'pdf', date: '2m ago' },
        { name: 'Lecture_Notes_01.docx', size: '850 KB', type: 'doc', date: '1h ago' },
        { name: 'Diagram_Structure.png', size: '4.2 MB', type: 'img', date: '3h ago' },
        { name: 'main_script.py', size: '12 KB', type: 'code', date: '5h ago' },
        { name: 'Lab_Report_Template.pdf', size: '1.1 MB', type: 'pdf', date: '1d ago' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="text-error" />;
            case 'doc': return <FileText className="text-primary" />;
            case 'img': return <Image className="text-accent" />;
            case 'code': return <FileCode className="text-neutral" />;
            default: return <FileText />;
        }
    };

    return (
        <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-base-content">Recent Uploads</h3>
                <button className="text-xs text-primary font-medium hover:underline">View All</button>
            </div>

            <div className="flex flex-col gap-2">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-base-200/50 transition-colors group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                            {getIcon(file.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-base-content truncate">{file.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-base-content/60">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.date}</span>
                            </div>
                        </div>

                        <button className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentFiles;