import { Question } from './question';

export interface Poll {
    description: string,
    created_at?: Date;
    id: number;
    institution?: any;
    name: string;
    question?: Question [];
    status?: boolean;
    updated_at?: Date;

    type_poll?: string;
}
/* created_at: "2020-07-08T16:57:17.441Z"
description: "En esta encuesta de Nuevo Producto, podráayudar con una información importante para el lanzamiento de un nuevo producto↵"
id: 2
institution: null
name: "Nuevo Producto"
question: (3) [{…}, {…}, {…}]
status: true
updated_at: "2020-07-08T18:53:15.703Z" */
