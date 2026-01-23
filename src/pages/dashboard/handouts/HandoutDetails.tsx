import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, BookOpen, Save, FileText, Settings2, CheckCircle2 } from 'lucide-react';
import SectionTable from '@/components/dashboard/handouts/SectionTable';
import CreateSectionModal from '@/components/dashboard/handouts/CreateSectionModal';
import EditSectionModal from '@/components/dashboard/handouts/EditSectionModal';
import ConfigModal from '@/components/dashboard/handouts/ConfigModal';
import AlertModal from '@/components/common/AlertModal';
import handoutService from '@/services/handoutService';
import sectionService from '@/services/sectionService';
import authService from '@/services/authService';
import { Handout, Section, NewSectionData, SectionStructureItem, UserProfile } from '@/types';
import { useTranslation } from 'react-i18next';

const HandoutDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [handout, setHandout] = useState<Handout | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingOrder, setSavingOrder] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [updatingYaml, setUpdatingYaml] = useState(false);
    const [subtitle, setSubtitle] = useState('');
    const [isUpdatingSubtitle, setIsUpdatingSubtitle] = useState(false);
    const [showSubtitleSuccess, setShowSubtitleSuccess] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!id) return;
            try {
                const [handoutData, sectionsData, userData] = await Promise.all([
                    handoutService.getHandoutById(id),
                    sectionService.getSections(id),
                    authService.getCurrentUser()
                ]);
                setHandout(handoutData);
                setSections(sectionsData);
                setUser(userData);
                setSubtitle(handoutData.subtitle || '');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const fetchData = async () => {
        if (!id) return;
        try {
            const [handoutData, sectionsData, userData] = await Promise.all([
                handoutService.getHandoutById(id),
                sectionService.getSections(id),
                authService.getCurrentUser()
            ]);
            setHandout(handoutData);
            setSections(sectionsData);
            setUser(userData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateSubtitle = async () => {
        if (!id || subtitle === handout?.subtitle || isUpdatingSubtitle) return;

        setIsUpdatingSubtitle(true);
        try {
            const updated = await handoutService.updateHandout(id, { subtitle });
            setHandout(updated);
            setShowSubtitleSuccess(true);
            setTimeout(() => setShowSubtitleSuccess(false), 2000);
        } catch (error) {
            console.error("Failed to update subtitle:", error);
        } finally {
            setIsUpdatingSubtitle(false);
        }
    };

    const handleSubtitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    const handleCreateSection = async (data: NewSectionData) => {
        if (user && user.current_storage_usage >= user.storage_limit) {
            setIsAlertOpen(true);
            return;
        }
        try {
            await sectionService.createSection(data);
            await fetchData();
        } catch (error: any) {
            if (error.response?.data?.storage) {
                setIsAlertOpen(true);
            }
            throw error;
        }
    };

    const handleEditSection = (section: Section) => {
        setEditingSection(section);
        setIsEditModalOpen(true);
    };

    const handleUpdateSection = async (sectionId: string, data: { title: string; content: string; parent?: string | null }) => {
        try {
            await sectionService.updateSection(sectionId, data);
            await fetchData();
        } catch (error: any) {
            if (error.response?.data?.storage) {
                setIsAlertOpen(true);
            }
            throw error;
        }
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm(t('section_table.confirm_delete'))) return;
        try {
            await sectionService.deleteSection(sectionId);
            setSections(sections.filter(s => s.id !== sectionId));
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSectionsUpdate = (newSections: Section[]) => {
        setSections(newSections);
        setHasUnsavedChanges(true);
    };

    const handleSaveOrder = async () => {
        if (!id) return;
        setSavingOrder(true);
        try {
            const structure: SectionStructureItem[] = sections.map(s => ({
                id: s.id,
                parent_id: s.parent,
                order: s.order
            }));
            await handoutService.reorderSections(id, structure);
            await fetchData();
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSavingOrder(false);
        }
    };

    const handleUpdateYaml = async (newYaml: string) => {
        if (!id || !handout) return;
        setUpdatingYaml(true);
        try {
            const updatedHandout = await handoutService.updateHandout(id, {
                yaml_config: newYaml
            });
            setHandout(updatedHandout);
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingYaml(false);
        }
    };

    const handleExportPdf = async () => {
        if (!handout || !user) return;

        if (user.current_storage_usage >= user.storage_limit) {
            setIsAlertOpen(true);
            return;
        }

        setExporting(true);
        try {
            const blob = await handoutService.exportPdf(handout.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${handout.title.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            await fetchData();
        } catch (error) {
            console.error(error);
        } finally {
            setExporting(false);
        }
    };

    const openCreateModal = () => {
        if (user && user.current_storage_usage >= user.storage_limit) {
            setIsAlertOpen(true);
            return;
        }
        setIsCreateModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    if (!handout) return <div>Handout not found</div>;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <button onClick={() => navigate('/handouts')} className="btn btn-circle btn-ghost border border-base-200">
                    <ArrowLeft size={24} />
                </button>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 text-neutral rounded-full">
                            <BookOpen size={24} />
                        </div>
                        <div className="flex flex-col w-full max-w-xl">
                            <h1 className="text-3xl font-bold text-base-content">{handout.title}</h1>
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase opacity-40 tracking-widest">
                                        Subtitle (Max 30 chars, use "|" for break)
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {isUpdatingSubtitle && <Loader2 size={10} className="animate-spin opacity-40" />}
                                        {showSubtitleSuccess && <CheckCircle2 size={10} className="text-success" />}
                                    </div>
                                </div>
                                <input
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value.slice(0, 50))}
                                    onBlur={handleUpdateSubtitle}
                                    onKeyDown={handleSubtitleKeyDown}
                                    placeholder="Add a subtitle..."
                                    className="bg-transparent border-b border-dashed border-base-content/20 focus:border-accent outline-none text-sm text-base-content/60 w-full py-1 transition-all focus:border-solid"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsConfigModalOpen(true)}
                        className="btn btn-ghost border border-base-200 rounded-full gap-2 px-5"
                    >
                        {updatingYaml ? <Loader2 size={18} className="animate-spin" /> : <Settings2 size={18} />}
                        {t('handouts.edit_config')}
                    </button>

                    <button
                        onClick={handleExportPdf}
                        disabled={exporting}
                        className="btn btn-neutral text-neutral-content rounded-full gap-2 px-6"
                    >
                        {exporting ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                        {t('handouts.export_pdf')}
                    </button>
                </div>
            </div>

            <div className="divider"></div>

            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold">{t('handouts.table_of_contents')}</h2>
                    <p className="text-sm text-base-content/50 mt-1">
                        {sections.length} {sections.length === 1 ? t('handouts.section') : t('handouts.sections')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSaveOrder}
                        disabled={!hasUnsavedChanges || savingOrder}
                        className={`btn gap-2 rounded-full transition-all ${hasUnsavedChanges ? 'btn-warning text-warning-content shadow-md' : 'btn-ghost text-base-content/50'}`}
                    >
                        {savingOrder ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {hasUnsavedChanges ? t('handouts.save_changes') : t('handouts.order_saved')}
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="btn btn-neutral text-neutral-content rounded-full gap-2 shadow-lg shadow-neutral/20"
                    >
                        <Plus size={20} />
                        {t('handouts.add_section')}
                    </button>
                </div>
            </div>

            <SectionTable
                sections={sections}
                onDelete={handleDeleteSection}
                onEdit={handleEditSection}
                onUpdateSections={handleSectionsUpdate}
            />

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={t('storage.limit_reached_title')}
                content={t('storage.limit_reached_message')}
                level="error"
                actionLabel={t('storage.upgrade_to_pro')}
                onAction={() => navigate('/dashboard')}
            />

            <ConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onSave={handleUpdateYaml}
                currentConfig={handout.yaml_config || ''}
            />

            <CreateSectionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSection}
                handoutId={handout.id}
                existingSections={sections}
            />

            <EditSectionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateSection}
                section={editingSection}
                allSections={sections}
            />
        </div>
    );
};

export default HandoutDetails;