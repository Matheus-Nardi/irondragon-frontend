export class Boleto {
    id!: number;
    valor!: number;
    pago!: boolean
    codigoBarras!: string;
    dataValidade!: Date;
}