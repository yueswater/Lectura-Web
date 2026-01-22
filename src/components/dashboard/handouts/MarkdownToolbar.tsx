import { useState } from 'react';
import {
    Bold, Italic, List, ListOrdered, Quote, Code,
    Link as LinkIcon, Image as ImageIcon,
    Sigma, Table, Minus, ChevronDown,
    AlignLeft, AlignCenter, AlignRight, Palette
} from 'lucide-react';

interface MarkdownToolbarProps {
    onAction: (prefix: string, suffix: string) => void;
}

const MarkdownToolbar = ({ onAction }: MarkdownToolbarProps) => {
    const [hoverGrid, setHoverGrid] = useState({ r: 0, c: 0 });

    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Gray', value: '#64748b' },
    ];

    const orderedListTypes = [
        { label: '1. 2. 3.', prefix: '1. ' },
        { label: 'a. b. c.', prefix: 'a. ' },
        { label: 'A. B. C.', prefix: 'A. ' },
        { label: 'i. ii. iii.', prefix: 'i. ' },
        { label: 'I. II. III.', prefix: 'I. ' },
        { label: '甲. 乙. 丙.', prefix: '甲. ' },
    ];

    const generateTable = (rows: number, cols: number, align: 'left' | 'center' | 'right') => {
        const alignMap = { left: ':---', center: ':---:', right: '---:' };
        const sep = alignMap[align];
        let header = '| ' + Array(cols).fill('Header').join(' | ') + ' |\n';
        let divider = '| ' + Array(cols).fill(sep).join(' | ') + ' |\n';
        let body = '';
        for (let i = 0; i < rows; i++) {
            body += '| ' + Array(cols).fill('Content').join(' | ') + ' |\n';
        }
        onAction(`\n${header}${divider}${body}\n`, '');
        if (document.activeElement instanceof HTMLElement) (document.activeElement as HTMLElement).blur();
    };

    const primaryTools = [
        { icon: <Bold size={18} />, prefix: '**', suffix: '**', label: 'Bold' },
        { icon: <Italic size={18} />, prefix: '_', suffix: '_', label: 'Italic' },
        { icon: <Quote size={18} />, prefix: '> ', suffix: '', label: 'Quote' },
        { icon: <Code size={18} />, prefix: '`', suffix: '`', label: 'Code' },
        { icon: <List size={18} />, prefix: '- ', suffix: '', label: 'Bullet List' },
    ];

    const utilityTools = [
        { icon: <LinkIcon size={18} />, prefix: '[', suffix: '](url)', label: 'Link' },
        { icon: <ImageIcon size={18} />, prefix: '![alt](', suffix: ')', label: 'Image' },
        { icon: <Sigma size={18} />, prefix: '$$ ', suffix: ' $$', label: 'Math' },
        { icon: <Minus size={18} />, prefix: '\n---\n', suffix: '', label: 'Divider' },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-base-200 bg-base-50">
            {primaryTools.map((tool, index) => (
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

            <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-1 flex items-center gap-0 hover:bg-base-200">
                    <Palette size={18} />
                    <ChevronDown size={14} />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-xl bg-base-100 rounded-box w-48 border border-base-200 grid grid-cols-4 gap-1">
                    {colors.map((color) => (
                        <li key={color.value}>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full p-0 flex items-center justify-center hover:scale-110 transition-transform"
                                style={{ backgroundColor: color.value }}
                                onClick={() => {
                                    onAction(`<span style="color: ${color.value}">`, '</span>');
                                    if (document.activeElement instanceof HTMLElement) (document.activeElement as HTMLElement).blur();
                                }}
                                title={color.name}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-1 flex items-center gap-0 hover:bg-base-200" title="Ordered List">
                    <ListOrdered size={18} />
                    <ChevronDown size={14} />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-200">
                    {orderedListTypes.map((type, idx) => (
                        <li key={idx}>
                            <button type="button" className="text-xs" onClick={() => { onAction(type.prefix, ''); if (document.activeElement instanceof HTMLElement) (document.activeElement as HTMLElement).blur(); }}>
                                <span className="font-bold">{type.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-1 flex items-center gap-0 hover:bg-base-200" title="Table">
                    <Table size={18} />
                    <ChevronDown size={14} />
                </div>
                <div tabIndex={0} className="dropdown-content z-[20] p-5 shadow-2xl bg-base-100 rounded-2xl w-[260px] border border-base-200 mt-2">
                    <div className="mb-5">
                        <p className="text-[10px] font-black opacity-40 mb-2 uppercase tracking-widest">Alignment</p>
                        <div className="flex gap-2 p-1 bg-base-200 rounded-xl w-fit">
                            <button onClick={() => generateTable(2, 2, 'left')} className="btn btn-xs btn-ghost btn-square hover:bg-base-100"><AlignLeft size={14} /></button>
                            <button onClick={() => generateTable(2, 2, 'center')} className="btn btn-xs btn-ghost btn-square hover:bg-base-100"><AlignCenter size={14} /></button>
                            <button onClick={() => generateTable(2, 2, 'right')} className="btn btn-xs btn-ghost btn-square hover:bg-base-100"><AlignRight size={14} /></button>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Quick Grid</p>
                        <span className="text-[10px] font-mono font-bold text-accent">{hoverGrid.r} x {hoverGrid.c}</span>
                    </div>
                    <div className="grid grid-cols-9 gap-1.5 p-2 bg-base-200 rounded-xl" onMouseLeave={() => setHoverGrid({ r: 0, c: 0 })}>
                        {Array.from({ length: 9 }, (_, r) => r + 1).map(r =>
                            Array.from({ length: 9 }, (_, c) => c + 1).map(c => (
                                <div key={`${r}-${c}`} onMouseEnter={() => setHoverGrid({ r, c })} onClick={() => generateTable(r, c, 'left')} className={`w-4 h-4 rounded-[4px] cursor-pointer transition-all duration-75 ${r <= hoverGrid.r && c <= hoverGrid.c ? 'bg-accent scale-110 z-10 shadow-md' : 'bg-base-100 border border-base-300 hover:border-accent/40'}`} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {utilityTools.map((tool, index) => (
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