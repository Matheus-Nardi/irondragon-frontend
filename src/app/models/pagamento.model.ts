export class Pagamento {
    id!: number;
    valor!: number;
    pago!: boolean;
    tipoPagamento!: string;
    dataValidade?: Date;
}
