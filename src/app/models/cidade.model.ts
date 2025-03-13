import { Estado, IEstado } from "./estado.model";

export interface ICidade {
    id?: number;
    nome: string;
    estado: IEstado;
}

export class Cidade {
    id!: number;
    nome!: string;
    estado!: Estado;

    public static valueOf(cidade: ICidade): Cidade {
        const novaCidade: Cidade = new Cidade();
        novaCidade.nome = cidade.nome;
        novaCidade.estado = Estado.valueOf(cidade.estado);

        return novaCidade;
    }
}