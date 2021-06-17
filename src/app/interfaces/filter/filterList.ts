import { InstitutionCategories } from '../institution/institutionCategories';

export interface FilterList {
    name: string;
    open: boolean;
    types: Array<InstitutionCategories>;
}
