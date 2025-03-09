import { Telefone, ITelefone } from "./telefone.model";

interface IFornecedor {
    id?: number;
    nome: string;
    email: string;
    telefone: ITelefone;
}

export class Fornecedor {
    id!: number;
    nome!: string;
    email!: string;
    telefone!: Telefone;

    public static valueOf(fornecedor: IFornecedor): Fornecedor {
        const novoFornecedor: Fornecedor = new Fornecedor();

        novoFornecedor.nome = fornecedor.nome;
        novoFornecedor.email = fornecedor.email;
        novoFornecedor.telefone = Telefone.valueOf(fornecedor.telefone);
        return novoFornecedor;
    }
   
}