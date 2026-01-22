import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'zh_TW', label: '繁體中文' },
        { code: 'zh_CN', label: '简体中文' },
        { code: 'th', label: 'ไทย' }
    ];

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle hover:bg-base-content/10 transition-colors">
                <Languages size={20} />
            </label>
            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-2xl bg-base-100 rounded-2xl w-40 mt-4 border border-base-content/5">
                {languages.map((lang) => (
                    <li key={lang.code}>
                        <button
                            className={`flex justify-between items-center px-4 py-2 rounded-xl transition-all ${i18n.language === lang.code
                                    ? 'bg-neutral text-neutral-content font-bold'
                                    : 'hover:bg-base-content/10'
                                }`}
                            onClick={() => i18n.changeLanguage(lang.code)}
                        >
                            {lang.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LanguageSwitcher;