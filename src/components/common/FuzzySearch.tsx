import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Fuse from 'fuse.js';

interface FuzzySearchProps<T> {
    data: T[];
    keys: string[];
    onResult: (results: T[]) => void;
    placeholder?: string;
    className?: string;
}

const FuzzySearch = <T,>({
    data,
    keys,
    onResult,
    placeholder = "Search...",
    className = ""
}: FuzzySearchProps<T>) => {
    const [query, setQuery] = useState('');
    const fuseRef = useRef<Fuse<T> | null>(null);

    useEffect(() => {
        fuseRef.current = new Fuse(data, {
            keys,
            threshold: 0.3,
            distance: 100,
            ignoreLocation: true,
        });

        if (query.trim() === '') {
            onResult(data);
        } else {
            const results = fuseRef.current.search(query).map(r => r.item);
            onResult(results);
        }
    }, [data, keys]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (!val.trim()) {
            onResult(data);
            return;
        }

        if (fuseRef.current) {
            const results = fuseRef.current.search(val).map(r => r.item);
            onResult(results);
        }
    };

    const clearSearch = () => {
        setQuery('');
        onResult(data);
    };

    return (
        <div className={`relative group ${className}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40 group-focus-within:text-accent transition-colors" />
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder={placeholder}
                className="input w-full h-11 pl-12 pr-10 rounded-full bg-base-100 border-transparent focus:border-base-200 focus:bg-white shadow-sm transition-all text-sm"
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-base-200 rounded-full transition-colors"
                >
                    <X size={16} className="text-base-content/40" />
                </button>
            )}
        </div>
    );
};

export default FuzzySearch;