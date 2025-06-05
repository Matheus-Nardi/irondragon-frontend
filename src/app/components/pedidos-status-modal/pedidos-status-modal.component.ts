import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from '../../models/pedido.model';
import { StatusPedido } from '../../models/status-pedido.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgModel } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-pedidos-status-modal',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgIf,
    NgFor
  ],
  templateUrl: './pedidos-status-modal.component.html',
  styleUrl: './pedidos-status-modal.component.css'
})
export class PedidosStatusModalComponent implements OnInit {

  novoStatusPedido: StatusPedido | null = null;

  constructor(
    public dialogRef: MatDialogRef<PedidosStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pedido: Pedido, statusOptions: StatusPedido[] }
  ) { }

  ngOnInit(): void {
    this.novoStatusPedido = this.data.pedido.statusPedido;
  }

  onConfirmar(): void {
    this.dialogRef.close(this.novoStatusPedido);
  }

  onCancelar(): void {
    this.dialogRef.close(null);
  }

  statusDisplayMap: Record<string, string> = {
    PEDIDO_EXPIRADO: 'Expirado',
    PEDIDO_CANCELADO: 'Cancelado',
    PAGAMENTO_PENDENTE: 'Pagamento Pendente',
    PREPARANDO_PRODUTO: 'Preparando Produto',
    PRODUTO_ENVIADO: 'Enviado',
    PRODUTO_ENTREGUE: 'Entregue',
    PRODUTO_DEVOLVIDO: 'Devolvido'
  };

  getStatusIcon(label: string): string {
  switch (label) {
    case 'PEDIDO_EXPIRADO':
      return 'schedule';
    case 'PEDIDO_CANCELADO':
      return 'cancel';
    case 'PAGAMENTO_PENDENTE':
      return 'hourglass_empty';
    case 'PREPARANDO_PRODUTO':
      return 'autorenew';
    case 'PRODUTO_ENVIADO':
      return 'local_shipping';
    case 'PRODUTO_ENTREGUE':
      return 'done_all';
    case 'PRODUTO_DEVOLVIDO':
      return 'keyboard_return';
    default:
      return 'help_outline';
  }
}


}
