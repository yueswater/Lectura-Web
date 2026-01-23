import api from './api';
import { Handout, NewHandoutData, SectionStructureItem } from '../types';

const getHandouts = async (projectId?: string): Promise<Handout[]> => {
    const url = projectId
        ? `content/handouts/handouts/?project=${projectId}`
        : 'content/handouts/handouts/';

    const response = await api.get(url);
    if (Array.isArray(response.data)) {
        return response.data;
    }
    return response.data.results || [];
};

const getHandoutById = async (id: string): Promise<Handout> => {
    const response = await api.get(`content/handouts/handouts/${id}/`);
    return response.data;
};

const createHandout = async (data: NewHandoutData): Promise<Handout> => {
    const response = await api.post('content/handouts/handouts/', data);
    return response.data;
};

const updateHandout = async (id: string, data: Partial<Handout>): Promise<Handout> => {
    const response = await api.patch(`content/handouts/handouts/${id}/`, data);
    return response.data;
};

const reorderSections = async (handoutId: string, structure: SectionStructureItem[]): Promise<void> => {
    await api.post(`content/handouts/handouts/${handoutId}/reorder-sections/`, { structure });
};

const uploadAttachment = async (file: File, caption: string, altText: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('alt_text', altText);

    const response = await api.post('content/handouts/attachments/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const exportPdf = async (handoutId: string): Promise<Blob> => {
    const response = await api.get(`content/handouts/handouts/${handoutId}/export-pdf/`, {
        responseType: 'blob',
    });
    return response.data;
};

const handoutService = {
    getHandouts,
    getHandoutById,
    createHandout,
    updateHandout,
    reorderSections,
    uploadAttachment,
    exportPdf,
};

export default handoutService;