import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarkdownPreviewProps {
    content: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="bg-base-200/50 px-4 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
                <Eye size={14} /> {t('section.edit.preview')}
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
                <article className="prose prose-sm md:prose-base max-w-none whitespace-pre-wrap">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                    >
                        {content}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    );
};

export default MarkdownPreview;