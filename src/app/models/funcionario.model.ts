import { Usuario } from "./usuario.model";

export class Funcionario {
    id!: number;
    usuario!: Usuario;
    dataContratacao!: Date;
    cargo!: string;
    salario!: number;
}
