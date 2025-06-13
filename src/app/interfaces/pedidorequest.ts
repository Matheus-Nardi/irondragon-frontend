import { ItemPedido } from "../models/item-pedido.model";


export interface PedidoRequest {
    idEndereco: number;
    listaItemPedido: ItemPedido[];
    tipoPagamento: string;
    idCartao?: Number;
}
