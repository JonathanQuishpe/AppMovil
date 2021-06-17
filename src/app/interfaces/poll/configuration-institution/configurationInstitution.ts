import { PollInstitution } from './pollInstitution'
import { Reward } from '../../wallet/reward'

export interface ConfigurationInstitution {
    id: number;
    name: string;
    status: boolean;
    poll: PollInstitution;
    reward: Reward;
    institution: number;
    created_at: Date;
    updated_at: Date;
    type: string;
    date_init: Date;
    date_end: Date;
    unique: string;
    multiple: boolean
  }

