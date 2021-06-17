export interface Question {
    id: number;
    institution?: any;
    multimedia?: any[];
    placeholder: string;
    question: string;
    relation_extra: any;
    required: boolean;
    type: string;
    image: boolean;
    appreciation?: any;
    description?: any;
    value: any; // string || Array<string>
}
  