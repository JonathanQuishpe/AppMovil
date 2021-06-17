import { Poll } from '../poll/poll'
import { Reward } from '../wallet/reward'
import { Institution } from './institution'

export interface InstitutionResults {
    id: number;
    name: string;
    status: boolean;
    poll: Poll;
    reward: Reward;
    institution: Institution;
    created_at: Date;
    updated_at: Date
    type: string;
    date_init: Date;
    date_end: Date;
    unique: string;
    multiple: boolean;
    audiences: any;
}


