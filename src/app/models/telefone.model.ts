import { Fornecedor } from "./fornecedor.model";

export interface ITelefone {
    id?: number;
    codigoArea: string;
    numero: string;
}

export class Telefone {
    id?: number;
    codigoArea!: string;
    numero!: string;

    public static valueOf(telefone: ITelefone): Telefone{
        const novoTelefone = new Telefone();
        
        novoTelefone.id = telefone.id;
        novoTelefone.codigoArea = telefone.codigoArea;
        novoTelefone.numero = telefone.numero;
        return novoTelefone;
    }
}