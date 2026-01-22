import { useNavigate } from 'react-router-dom';
import { Eye, FileText } from 'lucide-react';
import { Handout } from '@/types';
import { useTranslation } from 'react-i18next';

interface HandoutTableProps {
    handouts: Handout[];
}

const HandoutTable = ({ handouts }: HandoutTableProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto bg-base-100 rounded-3xl shadow-sm border border-base-200">
            <table className="table table-lg">
                <thead>
                    <tr className="bg-base-200/50 text-base-content/70">
                        <th>{t('handout_table.title')}</th>
                        <th>{t('handout_table.description')}</th>
                        <th>{t('handout_table.status')}</th>
                        <th>{t('handout_table.last_updated')}</th>
                        <th className="text-right">{t('handout_table.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {handouts.length > 0 ? (
                        handouts.map((handout) => (
                            <tr
                                key={handout.id}
                                className="hover:bg-base-200/30 transition-colors cursor-pointer"
                                onClick={() => navigate(`/handouts/${handout.id}`)}
                            >
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral/10 text-neutral/70 rounded-xl w-10 h-10">
                                                <FileText size={20} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{handout.title}</div>
                                            <div className="text-sm opacity-50">{handout.subject || 'General'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="max-w-xs truncate opacity-70">
                                    {handout.description || 'No description'}
                                </td>
                                <td>
                                    <div className={`badge ${handout.is_published ? 'badge-success' : 'badge-ghost'} gap-2`}>
                                        {handout.is_published ? 'Published' : 'Draft'}
                                    </div>
                                </td>
                                <td className="opacity-70">
                                    {new Date(handout.updated_at).toLocaleDateString()}
                                </td>
                                <td className="text-right">
                                    <button className="btn btn-ghost btn-circle btn-sm">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-base-content/50">
                                {t('handouts.no_handouts')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HandoutTable;