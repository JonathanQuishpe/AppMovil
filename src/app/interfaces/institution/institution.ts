import { BranchOffice } from "./branchOffice";
import { ConfigurationInstitution } from '../poll/configuration-institution/configurationInstitution';

export interface Institution {
  cellphone: string;
  city: number;
  document: string;
  main_street: string;
  name: string;
  nomenclature: string;
  parish: number;
  phone: string;
  province: number;
  side_street: string;
  type: string;
  updated_at: Date;
  image?: any;
  

  configuration?: number;
  created_at?: Date;
  id?: number;
  poll?: any;
  reward?: any;
  status?: boolean;
  type_institution?: string;
  user?: number;
  open?: boolean;

  branch_offices?: BranchOffice[];
  configurations?: ConfigurationInstitution[];
}
