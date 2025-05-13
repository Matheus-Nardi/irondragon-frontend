
import { Endereco } from "./endereco/endereco.model";
import { Perfil } from "./perfil.model";
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
    //falta adicionar enderecos e imagens
}
