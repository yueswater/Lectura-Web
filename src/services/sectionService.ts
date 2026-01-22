import api from './api';
import { Section, NewSectionData } from '../types';

interface UpdateSectionData {
    title?: string;
    content?: string;
    parent?: string | null;
}

const getSections = async (handoutId: string): Promise<Section[]> => {
    const response = await api.get(`content/handouts/sections/?handout=${handoutId}`);
    if (Array.isArray(response.data)) {
        return response.data;
    }
    return response.data.results || [];
};

const createSection = async (data: NewSectionData): Promise<Section> => {
    const response = await api.post('content/handouts/sections/', data);
    return response.data;
};

const updateSection = async (id: string, data: UpdateSectionData): Promise<Section> => {
    const response = await api.patch(`content/handouts/sections/${id}/`, data);
    return response.data;
};

const deleteSection = async (id: string): Promise<void> => {
    await api.delete(`content/handouts/sections/${id}/`);
};

const sectionService = {
    getSections,
    createSection,
    updateSection,
    deleteSection,
};

export default sectionService;