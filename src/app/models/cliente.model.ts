import { Cartao } from "./cartao.model";
import { Processador } from "./processador/processador.model";
import { Usuario } from "./usuario.model";

export class Cliente {
usuario!: Usuario;
listaDeDesejos!: Array<Processador>;
listaDeCartoes!: Array<Cartao>;
}
