export enum FormStatus {
    CREATE,
    EDIT
}

export interface JobAd {
    id?: string;
    title: string;
    description: string;
    skills: string[];
    isPublished: boolean;
}