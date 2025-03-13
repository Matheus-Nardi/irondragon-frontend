// A ! serve para afirmar que o valor não sera undefined , tipo confia mim
export interface IEstado {
    id?: number;
    nome: string;
    sigla: string;
}

export class Estado {
    id!: number;
    nome!: string;
    sigla!: string;

    public static valueOf(estado: IEstado): Estado {
        const novoEstado: Estado = new Estado();
        novoEstado.nome = estado.nome;
        novoEstado.sigla = estado.sigla;

        return novoEstado;
    }
}
