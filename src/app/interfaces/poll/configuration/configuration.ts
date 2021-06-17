import { Config } from "./config";
import { Institution } from "./institution";
import { Poll } from "../poll";
import { Reward } from "../../wallet/reward";

export interface Configuration {
  config: Config;
  institution: Institution;
  poll: Poll;
  reward: Reward;
  favorite: boolean;
}
