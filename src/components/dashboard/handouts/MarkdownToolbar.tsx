import { 
    Bold, Italic, List, ListOrdered, Quote, Code, 
    Heading1, Heading2, Link as LinkIcon, Image as ImageIcon,
    Sigma, Table 
} from 'lucide-react';

interface MarkdownToolbarProps {
    onAction: (prefix: string, suffix: string) => void;
}

const MarkdownToolbar = ({ onAction }: MarkdownToolbarProps) => {
    const tools = [
        { icon: <Heading1 size={18} />, prefix: '# ', suffix: '', label: 'H1' },
        { icon: <Heading2 size={18} />, prefix: '## ', suffix: '', label: 'H2' },
        { icon: <Bold size={18} />, prefix: '**', suffix: '**', label: 'Bold' },
        { icon: <Italic size={18} />, prefix: '_', suffix: '_', label: 'Italic' },
        { icon: <Quote size={18} />, prefix: '> ', suffix: '', label: 'Quote' },
        { icon: <Code size={18} />, prefix: '`', suffix: '`', label: 'Code' },
        { icon: <List size={18} />, prefix: '- ', suffix: '', label: 'Bullet List' },
        { icon: <ListOrdered size={18} />, prefix: '1. ', suffix: '', label: 'Numbered List' },
        { icon: <LinkIcon size={18} />, prefix: '[', suffix: '](url)', label: 'Link' },
        { icon: <ImageIcon size={18} />, prefix: '![alt](', suffix: ')', label: 'Image' },
        { icon: <Sigma size={18} />, prefix: '$$ ', suffix: ' $$', label: 'Math' },
        { 
            icon: <Table size={18} />, 
            prefix: '\n| Header | Header | Header |\n| :--- | :--- | :--- |\n| Content | Content | Content |\n| Content | Content | Content |\n', 
            suffix: '', 
            label: 'Table' 
        }, 
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-base-200 bg-base-50">
            {tools.map((tool, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onAction(tool.prefix, tool.suffix)}
                    className="btn btn-ghost btn-sm btn-square hover:bg-base-200 transition-colors"
                    title={tool.label}
                >
                    {tool.icon}
                </button>
            ))}
        </div>
    );
};

export default MarkdownToolbar;