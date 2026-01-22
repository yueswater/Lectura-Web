import { UserProfile } from '@/types';

export const formatFullName = (user: UserProfile | null, lang: string): string => {
    if (!user) return '—';
    const first = user.first_name || '';
    const last = user.last_name || '';

    if (!first && !last) return '—';
    if (lang.startsWith('zh')) {
        return `${last}${first}`.trim();
    }
    return `${first} ${last}`.trim();
};