import { QuestionAnswered } from "./questionAnswered";
import { Institution } from '../institution/institution';
import { Reward } from '../wallet/reward';

export interface PollAnswered {
  configId: string | number;
  pollName: string;
  pollQuestionsLength: number;
  questions?: QuestionAnswered[];
  institution: Institution;
  reward: Reward;
}
