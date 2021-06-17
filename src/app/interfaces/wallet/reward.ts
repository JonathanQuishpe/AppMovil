import { ImgReward } from "./img-reward";

export interface Reward {
  id: number;
  name: string;
  cost: number;
  status: boolean;
  code_reward: any;
  type: string;
  validity: Date;
  description: string;
  institution: number;
  unique: any;
  image: ImgReward;
  branch_offices?: any;
  updated_at?: Date;
  created_at?: Date;

  type_reward?: any;
}
