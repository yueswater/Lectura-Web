import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeController = () => {
    const [theme, setTheme] = useState<string>(
        localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <label className="swap swap-rotate btn btn-ghost bg-transparent hover:bg-transparent btn-circle">
            <input
                type="checkbox"
                onChange={toggleTheme}
                checked={theme === 'dark'}
            />
            <div className="swap-off w-6 h-6 flex items-center justify-center">
                <Sun size={20} />
            </div>
            <div className="swap-on w-6 h-6 flex items-center justify-center">
                <Moon size={20} />
            </div>
        </label>
    );
};

export default ThemeController;