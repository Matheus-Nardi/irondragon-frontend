
import { Perfil } from "./perfil.model";
import { Telefone } from "./telefone.model";

export class Usuario {
    id!: number;
    username!:string;
    email!: string;
    senha!: string;
    cpf!: string;
    perfil!: Perfil;
    dataCriacao!: Date;
    dataNascimento!: Date;
    telefone!: Telefone;

    //falta adicionar enderecos e imagens
}
