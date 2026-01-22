import { Bold, Italic, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SelectionToolbarProps {
    visible: boolean;
    x: number;
    y: number;
    hexColor: string;
    onColorChange: (color: string) => void;
    onApplyFormat: (prefix: string, suffix: string) => void;
    onClose: () => void;
}

const SelectionToolbar = ({
    visible,
    x,
    y,
    hexColor,
    onColorChange,
    onApplyFormat,
    onClose
}: SelectionToolbarProps) => {
    const { t } = useTranslation();

    if (!visible) return null;

    return (
        <div
            className="absolute z-[60] bg-base-100 border border-base-200 shadow-2xl rounded-xl p-2 flex items-center gap-2 animate-in fade-in zoom-in duration-200"
            style={{ left: x, top: y }}
        >
            <button onClick={() => onApplyFormat('**', '**')} className="btn btn-ghost btn-xs btn-square">
                <Bold size={14} />
            </button>
            <button onClick={() => onApplyFormat('_', '_')} className="btn btn-ghost btn-xs btn-square">
                <Italic size={14} />
            </button>
            <div className="divider divider-horizontal mx-0"></div>
            <div className="flex items-center gap-1 bg-base-200 rounded-lg px-2 py-1">
                <input
                    type="color"
                    value={hexColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-4 h-4 rounded-full border-none bg-transparent cursor-pointer"
                />
                <button
                    onClick={() => onApplyFormat(`<span style="color: ${hexColor}">`, '</span>')}
                    className="text-[10px] font-bold text-neutral uppercase"
                >
                    {t('section.edit.apply')}
                </button>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-xs btn-square">
                <X size={14} />
            </button>
        </div>
    );
};

export default SelectionToolbar;