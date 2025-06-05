import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pedido } from '../../../models/pedido.model';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';
import { Processador } from '../../../models/processador/processador.model';
import { ProcessadorService } from '../../../services/processador.service';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { ItemPedido } from '../../../models/item-pedido.model';

@Component({
  selector: 'app-pedidos',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent {
  displayedColumns: string[] = [
    'id',
    'dataPedido',
    'items',
    'valorTotal',
    'statusPedido',
  ];
  constructor(
    private processadorService: ProcessadorService,
    private router: Router
  ) {}

  @Input() cliente!: Cliente;
  @Input() usuario!: Usuario;

  @Input() pedidos: Pedido[] = [];

  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() page = 0;

  @Output() paginar = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  loading = false;

  onPaginar(event: PageEvent): void {
    this.paginar.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  getImagemUrl(processador: Processador): string {
    return this.processadorService.getUrlImage(
      processador.id.toString(),
      processador.imagens[0]
    );
  }

  getDisplayItems(items: ItemPedido[]): ItemPedido[] {
    return items.slice(0, 2);
  }

  navegarParaDetalhes(id: any) {
    this.router.navigate(['perfil/pedidos', id]);
  }
  getStatusClass(id: number) {
    return {
      'status-expirado': id === 1,
      'status-cancelado': id === 2,
      'status-pendente': id === 3,
      'status-preparando': id === 4,
      'status-enviado': id === 5,
      'status-entregue': id === 6,
      'status-devolvido': id === 7,
    };
  }
}
