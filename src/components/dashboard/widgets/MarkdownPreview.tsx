import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Eye, Info, AlertTriangle, XCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarkdownPreviewProps {
    content: string;
}

interface CalloutConfig {
    icon: React.ReactNode; // Using React.ReactNode instead of JSX.Element
    color: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
    const { t } = useTranslation();

    const parseBlocks = (text: string) => {
        // Regex without ^ anchor to ensure it catches blocks even if not at absolute start
        const regex = /\/\/\/\s*admonition\s*\|\s*(.*)\n\s*type:\s*(\w+)\n\n([\s\S]*?)\n\/\/\//gm;
        let lastIndex = 0;
        const result: (string | React.ReactNode)[] = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push(text.substring(lastIndex, match.index));
            }

            const [, title, type, body] = match;

            // Fixed record type to solve TS7053
            const configMap: Record<string, CalloutConfig> = {
                info: { icon: <Info size={20} />, color: 'border-blue-500 bg-blue-50 text-blue-900' },
                warning: { icon: <AlertTriangle size={20} />, color: 'border-amber-500 bg-amber-50 text-amber-900' },
                danger: { icon: <XCircle size={20} />, color: 'border-red-500 bg-red-900 text-white shadow-red-200' },
                success: { icon: <CheckCircle size={20} />, color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                tip: { icon: <Lightbulb size={20} />, color: 'border-purple-500 bg-purple-50 text-purple-900' },
            };

            const config = configMap[type] || { icon: <Info size={20} />, color: 'border-gray-500 bg-gray-50 text-gray-900' };

            result.push(
                <div key={match.index} className={`my-6 border-l-4 rounded-r-xl p-4 shadow-sm ${config.color}`}>
                    <div className="flex items-center gap-2 font-bold mb-2">
                        {config.icon}
                        <span>{title || 'Note'}</span>
                    </div>
                    <div className="text-sm leading-relaxed prose-p:my-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
                            {body}
                        </ReactMarkdown>
                    </div>
                </div>
            );
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            result.push(text.substring(lastIndex));
        }

        return result;
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <style>{`
                .preview-container { counter-reset: fig-count; }
                .custom-figure { counter-increment: fig-count; }
                .fig-label::after { content: " " counter(fig-count); }
            `}</style>

            <div className="bg-base-200/50 px-4 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
                <Eye size={14} /> {t('section.edit.preview')}
            </div>

            <div className="flex-1 p-8 overflow-y-auto preview-container">
                <article className="prose prose-sm md:prose-base max-w-none">
                    {typeof content === 'string' ? parseBlocks(content).map((part, i) => (
                        typeof part === 'string' ? (
                            <ReactMarkdown
                                key={i}
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex, rehypeRaw]}
                                components={{
                                    img: ({ ...props }) => (
                                        <figure className="custom-figure my-8 flex flex-col items-center">
                                            <img
                                                {...props}
                                                className="rounded-xl shadow-lg border border-base-200 max-h-[500px] object-contain"
                                                alt={props.alt || ''}
                                            />
                                            <figcaption className="mt-3 text-sm font-medium text-base-content/60 flex items-center gap-1.5">
                                                <span className="fig-label font-bold text-accent after:content-[':']">
                                                    {t('section.edit.figure')}
                                                </span>
                                                <span>{props.alt}</span>
                                            </figcaption>
                                        </figure>
                                    )
                                }}
                            >
                                {part}
                            </ReactMarkdown>
                        ) : (
                            <React.Fragment key={i}>{part}</React.Fragment>
                        )
                    )) : null}
                </article>
            </div>
        </div>
    );
};

export default MarkdownPreview;