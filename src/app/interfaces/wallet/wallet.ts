import { Reward } from './reward';
import { User } from '../user/user';
import { Institution } from '../poll/configuration/institution';

export interface Wallet {
    assignment_date: Date,
    claim: boolean,
    claim_date: Date,
    email: string,
    reward: Reward;
    unique: string,
    created_at: Date,
    updated_at: Date,
    institution: Institution
}