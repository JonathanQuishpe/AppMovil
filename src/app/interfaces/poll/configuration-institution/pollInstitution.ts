export interface PollInstitution {
    id: number;
    name: string;
    description: string;
    status:boolean;
    created_at: Date;
    updated_at: Date;
    institution: any
    unique: string;
    type: string;
    type_poll: string;
}