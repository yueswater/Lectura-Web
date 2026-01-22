import api from './api';
import { Project, NewProjectData, Tag } from '../types';

const getProjects = async (): Promise<Project[]> => {
    const response = await api.get('projects/projects/');
    if (Array.isArray(response.data)) {
        return response.data;
    }
    return response.data.results || [];
};

const getProjectById = async (id: string): Promise<Project> => {
    const response = await api.get(`projects/projects/${id}/`);
    return response.data;
};

const getTags = async (): Promise<Tag[]> => {
    const response = await api.get('projects/tags/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
};

const createTag = async (data: { name: string; color: string }): Promise<Tag> => {
    const response = await api.post('projects/tags/', data);
    return response.data;
};

const createProject = async (data: NewProjectData): Promise<Project> => {
    const response = await api.post('projects/projects/', data);
    return response.data;
};

const downloadProjectZip = async (projectId: string) => {
    const response = await api.get(`projects/projects/${projectId}/download-zip/`, {
        responseType: 'blob',
    });
    return response.data;
}

const projectService = {
    getProjects,
    getProjectById,
    createProject,
    getTags,
    createTag,
    downloadProjectZip
};

export default projectService;