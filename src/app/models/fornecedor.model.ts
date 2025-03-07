import { Telefone } from "./telefone.model";

export class Fornecedor {
    id!: number;
    nome!: string;
    email!: string;
    telefone!: Telefone;
}