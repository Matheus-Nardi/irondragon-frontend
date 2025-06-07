
import { BandeiraCartao } from "./bandeira-cartao.model";
import { TipoCartao } from "./tipo-cartao.model";
export class Cartao {
    id?: number;
    nomeTitular!: string;
    numero!: string;
    cpf!: string;
    cvc!: string;
    validade!: Date;
    tipo!: TipoCartao;
    bandeira!: BandeiraCartao;
}
