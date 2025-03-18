import { Telefone, ITelefone } from "./telefone.model";

export interface IFornecedor {
    id?: number;
    nome: string;
    email: string;
    telefone: ITelefone;
}

export class Fornecedor {
    id?: number;
    nome!: string;
    email!: string;
    telefone!: Telefone;

    public static valueOf(fornecedor: IFornecedor): Fornecedor {
        const novoFornecedor: Fornecedor = new Fornecedor();

        novoFornecedor.id = fornecedor.id;
        novoFornecedor.nome = fornecedor.nome;
        novoFornecedor.email = fornecedor.email;
        novoFornecedor.telefone = Telefone.valueOf(fornecedor.telefone);
        return novoFornecedor;
    }
   
}