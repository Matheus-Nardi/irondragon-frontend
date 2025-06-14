
import { Endereco } from "./endereco/endereco.model";
import { Perfil } from "./perfil.model";
import { Processador } from "./processador/processador.model";
import { Telefone } from "./telefone.model";

export class Usuario {
    id!: number;
    nome!:string;
    email!: string;
    senha!: string;
    cpf!: string;
    perfil!: Perfil;
    dataCriacao!: Date;
    dataNascimento!: Date;
    telefone!: Telefone;
    enderecos!: Array<Endereco>;
    nomeImagem!: string;
}
