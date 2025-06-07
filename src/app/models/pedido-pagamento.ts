import { ItemPedidoPagamento } from "./item-pedido-pagamento";

export class PedidoPagamento {
    id?: number;
    idEndereco!: number;
    listaItemPedido!: ItemPedidoPagamento[];
    tipoPagamento!: string;
    idCartao!: Number;
}