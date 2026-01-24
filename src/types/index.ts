export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    tags: Tag[];
    created_at: string;
    updated_at: string;

}

export interface Handout {
    id: string;
    project: string;
    folder?: string;
    title: string;
    subtitle?: string;
    description: string;
    yaml_config: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    subject?: string;
    file_type?: 'pdf' | 'doc' | 'code' | 'img' | 'other';
    file_size?: string;
}

export type SectionLevel = 'section' | 'subsection' | 'subsubsection';

export interface Section {
    id: string;
    handout: string;
    parent: string | null;
    level: SectionLevel;
    title: string;
    content: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface SectionStructureItem {
    id: string;
    parent_id: string | null;
    order: number;
}

export interface NewProjectData {
    name: string;
    description: string;
    tag_ids: string[];
}

export interface NewHandoutData {
    title: string;
    description: string;
    project: string;
    folder?: string;
    yaml_config?: string;
}

export interface NewSectionData {
    handout: string;
    title: string;
    content?: string;
    parent?: string;
}

export interface UserProfile {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
    avatar: string | null;
    is_verified: boolean | null;
    tier: 'BETA' | 'FREE' | 'PRO' | 'ENTERPRISE';
    storage_limit: number;
    current_storage_usage: number;
    last_storage_warning_level: number;
}