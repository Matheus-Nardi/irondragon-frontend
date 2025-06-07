import { Cliente } from "./cliente.model";
import { Endereco } from "./endereco/endereco.model";
import { ItemPedido } from "./item-pedido.model";
import { Pagamento } from "./pagamento.model";
import { StatusPedido } from "./status-pedido.model";

export class Pedido {
    id!: number;
    data!: Date;
    cliente!: Cliente;
    enderecoEntrega!: Endereco;
    pagamento!: Pagamento;
    listaItemPedido!: ItemPedido[];
    valorTotal!: number;
    statusPedido!: StatusPedido;
    
}
