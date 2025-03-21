import { Fornecedor } from "./fornecedor.model";
import { Processador } from "./processador/processador.model";

export class Lote {
    id!: number;
    processador!: Processador;
    data!: Date;
    codigo!: string;
    estoque!: number;
    fornecedor!: Fornecedor;
}
