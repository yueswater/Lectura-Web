import { useState, useEffect } from 'react';
import { X, User, Save, Loader2, Palette, Type, RotateCcw, AlignLeft, Languages, Layout } from 'lucide-react';
import yaml from 'js-yaml';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/common/Select';

interface HeadingConfig {
    color: string;
    font: string;
}

interface TypographyConfig {
    h1: HeadingConfig;
    h2: HeadingConfig;
    h3: HeadingConfig;
    h4: HeadingConfig;
}

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (yamlConfig: string) => Promise<void>;
    currentConfig: string;
}

const ConfigModal = ({ isOpen, onClose, onSave, currentConfig }: ConfigModalProps) => {
    const DEFAULT_TYPOGRAPHY: TypographyConfig = {
        h1: { color: '#2E3440', font: 'sans' },
        h2: { color: '#3B4252', font: 'sans' },
        h3: { color: '#434C5E', font: 'sans' },
        h4: { color: '#4C566A', font: 'sans' },
    };

    const { t } = useTranslation();
    const [author, setAuthor] = useState('');
    const [institution, setInstitution] = useState('');
    const [date, setDate] = useState('');
    const [theme, setTheme] = useState('nordic_dark');
    const [fontStyle, setFontStyle] = useState('sans');
    const [indentMode, setIndentMode] = useState('none');
    const [language, setLanguage] = useState('en');
    const [pageNumberPos, setPageNumberPos] = useState('bottom-right');
    const [useCustomTypography, setUseCustomTypography] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typography, setTypography] = useState<TypographyConfig>(DEFAULT_TYPOGRAPHY);

    useEffect(() => {
        if (isOpen) {
            try {
                const parsed: any = yaml.load(currentConfig) || {};
                setAuthor(parsed.author || '');
                setInstitution(parsed.institution || '');
                setDate(parsed.date || '');
                setTheme(parsed.theme || 'nordic_dark');
                setFontStyle(parsed.font_style || 'sans');
                setIndentMode(parsed.indent_mode || 'none');
                setLanguage(parsed.language || 'en');
                setPageNumberPos(parsed.page_number_pos || 'bottom-right');
                setUseCustomTypography(parsed.use_custom_typography || false);
                setTypography(parsed.typography || DEFAULT_TYPOGRAPHY);
            } catch (e) {
                console.error(e);
            }
        }
    }, [isOpen, currentConfig]);

    const handleReset = () => {
        setTheme('nordic_dark');
        setFontStyle('sans');
        setIndentMode('none');
        setLanguage('en');
        setPageNumberPos('bottom-right');
        setUseCustomTypography(false);
        setTypography(DEFAULT_TYPOGRAPHY);
    };

    const handleHeadingChange = (level: keyof TypographyConfig, field: keyof HeadingConfig, value: string) => {
        setTypography(prev => ({
            ...prev,
            [level]: { ...prev[level], [field]: value }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const newConfig = {
                theme,
                font_style: fontStyle,
                indent_mode: indentMode,
                language,
                page_number_pos: pageNumberPos,
                author,
                institution,
                date,
                use_custom_typography: useCustomTypography,
                typography: useCustomTypography ? typography : undefined
            };
            await onSave(yaml.dump(newConfig));
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-base-100 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Save className="text-neutral" />
                            {t('handouts.config.title')}
                        </h3>
                        <button
                            onClick={handleReset}
                            className="btn btn-ghost btn-xs rounded-full gap-1 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <RotateCcw size={12} />
                            {t('handouts.config.reset')}
                        </button>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <User size={14} /> {t('handouts.config.basic_info')}
                            </h4>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">{t('handouts.config.author')}</span></label>
                                <input type="text" className="input input-bordered rounded-full focus:input-neutral h-10 px-4" value={author} onChange={(e) => setAuthor(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">{t('handouts.config.institute')}</span></label>
                                <input type="text" className="input input-bordered rounded-full focus:input-neutral h-10 px-4" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">{t('handouts.config.date')}</span></label>
                                <input type="date" className="input input-bordered rounded-full focus:input-neutral h-10 px-4" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            <Select
                                key={`lang-${isOpen}`}
                                label={t('handouts.config.document_lang')}
                                icon={Languages}
                                value={language}
                                onChange={setLanguage}
                                labelClassName="text-xs font-bold uppercase tracking-widest opacity-40 pt-2"
                                options={[
                                    { label: t('handouts.config.languages.english'), value: 'en' },
                                    { label: t('handouts.config.languages.traditional_chinese'), value: 'zh_TW' },
                                    { label: t('handouts.config.languages.simplified_chinese'), value: 'zh_CN' },
                                    { label: t('handouts.config.languages.thai'), value: 'th' }
                                ]}
                            />
                        </div>

                        <div className="space-y-4 border-l border-base-200 pl-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <Palette size={14} /> {t('handouts.config.global_style')}
                            </h4>

                            <Select
                                key={`theme-${isOpen}`}
                                label={t('handouts.config.base_theme')}
                                value={theme}
                                disabled={useCustomTypography}
                                onChange={setTheme}
                                options={[
                                    { label: t('handouts.config.themes.nordic_dark'), value: 'nordic_dark' },
                                    { label: t('handouts.config.themes.modern_blue'), value: 'modern_blue' },
                                    { label: t('handouts.config.themes.academic'), value: 'academic' }
                                ]}
                            />

                            <Select
                                key={`font-${isOpen}`}
                                label={t('handouts.config.base_font')}
                                value={fontStyle}
                                disabled={useCustomTypography}
                                onChange={setFontStyle}
                                options={[
                                    { label: t('handouts.config.font_styles.modern_sans'), value: 'sans' },
                                    { label: t('handouts.config.font_styles.classic_serif'), value: 'serif' }
                                ]}
                            />

                            <Select
                                key={`indent-${isOpen}`}
                                label={t('handouts.config.paragraph_indent')}
                                icon={AlignLeft}
                                value={indentMode}
                                onChange={setIndentMode}
                                labelClassName="text-xs font-bold uppercase tracking-widest opacity-40 pt-2"
                                options={[
                                    { label: t('handouts.config.indent_options.no_indent'), value: 'none' },
                                    { label: t('handouts.config.indent_options.indent_all'), value: 'all' },
                                    { label: t('handouts.config.indent_options.indent_except_first_paragraph'), value: 'except_first' }
                                ]}
                            />

                            <Select
                                key={`pos-${isOpen}`}
                                label={t('handouts.config.page_numbering_pos')}
                                icon={Layout}
                                value={pageNumberPos}
                                onChange={setPageNumberPos}
                                labelClassName="text-xs font-bold uppercase tracking-widest opacity-40 pt-2"
                                options={[
                                    {
                                        label: t('handouts.config.page_number_position.top'),
                                        options: [
                                            { label: t('handouts.config.page_number_position.top_left'), value: 'top-left' },
                                            { label: t('handouts.config.page_number_position.top_center'), value: 'top-center' },
                                            { label: t('handouts.config.page_number_position.top_right'), value: 'top-right' }
                                        ]
                                    },
                                    {
                                        label: t('handouts.config.page_number_position.bottom'),
                                        options: [
                                            { label: t('handouts.config.page_number_position.bottom_left'), value: 'bottom-left' },
                                            { label: t('handouts.config.page_number_position.bottom_center'), value: 'bottom-center' },
                                            { label: t('handouts.config.page_number_position.bottom_right'), value: 'bottom-right' }
                                        ]
                                    }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-base-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                                <Type size={14} /> {t('handouts.config.typography_override')}
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase opacity-40">{t('handouts.config.enable_custom')}</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-sm toggle-accent"
                                    checked={useCustomTypography}
                                    onChange={(e) => setUseCustomTypography(e.target.checked)}
                                />
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 transition-all duration-300 ${!useCustomTypography ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
                            {(['h1', 'h2', 'h3', 'h4'] as const).map((level) => (
                                <div key={level} className="flex items-center gap-4 bg-base-200/30 p-3 rounded-2xl">
                                    <span className="text-lg font-black opacity-20 w-8">{level.toUpperCase()}</span>
                                    <div className="flex-1 flex gap-2">
                                        <div className="relative flex-1">
                                            <select
                                                className="select select-bordered select-sm w-full rounded-full focus:select-neutral pl-8"
                                                value={typography[level].font}
                                                onChange={(e) => handleHeadingChange(level, 'font', e.target.value)}
                                            >
                                                <option value="sans">{t('handouts.config.font_styles.sans')}</option>
                                                <option value="serif">{t('handouts.config.font_styles.serif')}</option>
                                                <option value="mono">{t('handouts.config.font_styles.mono')}</option>
                                            </select>
                                            <Type size={12} className="absolute left-3 top-2.5 opacity-30" />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="color"
                                                className="w-8 h-8 rounded-full border-none p-0 bg-transparent cursor-pointer overflow-hidden"
                                                value={typography[level].color}
                                                onChange={(e) => handleHeadingChange(level, 'color', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-8">
                    <button onClick={onClose} className="btn flex-1 rounded-full border-none bg-base-200 hover:bg-base-300">{t('handouts.config.cancel')}</button>
                    <button onClick={handleSave} disabled={loading} className="btn btn-neutral flex-1 rounded-full text-white shadow-lg shadow-neutral/20">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : t('handouts.config.apply')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigModal;