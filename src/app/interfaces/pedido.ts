import { Itempedido } from "./itempedido";

export interface Pedido {
        id: number;
    idEndereco: number;
    listaItemPedido: Itempedido[];
    tipoPagamento: string;
    idCartao: Number;
}
