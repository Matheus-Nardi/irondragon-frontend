import { ItemPedido } from "./item-pedido.model";

export class Pedido {
    id?: number;
    idEndereco!: number;
    listaItemPedido!: ItemPedido[];
    tipoPagamento!: string;
    idCartao!: Number;
}