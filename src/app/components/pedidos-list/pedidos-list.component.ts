import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { ItemPedido } from '../../models/item-pedido.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusPedido } from '../../models/status-pedido.model';
import { PedidosStatusModalComponent } from '../pedidos-status-modal/pedidos-status-modal.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-pedidos-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgClass,
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf,
    MatTooltipModule
  ],
  templateUrl: './pedidos-list.component.html',
  styleUrl: './pedidos-list.component.css'
})
export class PedidosListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'cliente', 'data', 'valorTotal', 'status', 'items', 'acoes'];
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  totalRecords = 0;
  pageSize = 8;
  page = 0;
  search: string = '';
  statusOptions: StatusPedido[] = [
    {
      id: 1,
      label: 'PEDIDO_EXPIRADO',
    },
    {
      id: 2,
      label: 'PEDIDO_CANCELADO',
    },
    {
      id: 3,
      label: 'PAGAMENTO_PENDENTE',
    },
    {
      id: 4,
      label: 'PREPARANDO_PRODUTO',
    },
    {
      id: 5,
      label: 'PRODUTO_ENVIADO',
    },
    {
      id: 6,
      label: 'PRODUTO_ENTREGUE',
    },
    {
      id: 7,
      label: 'PRODUTO_DEVOLVIDO',
    }
  ]


  constructor(private pedidoService: PedidoService, private matDialog: MatDialog, private snackbarService: SnackbarService) { }
  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.pedidoService.findAll(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.pedidos = response.results as Pedido[];
        this.totalRecords = response.count;
        this.pedidosFiltrados = this.pedidos;
      }
      ,
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPedidos();
  }

  getDisplayItems(items: ItemPedido[]): ItemPedido[] {
    return items.slice(0, 2);
  }

  onSearch(value: string): void {
    // Implemente a busca por id, cliente, etc.
  }

  onChangeStatusPedido(pedido: Pedido) {
    this.matDialog.open(PedidosStatusModalComponent, {
      data: {
        pedido: pedido,
        statusOptions: this.statusOptions
      },
      width: '600px',
    }).afterClosed().subscribe((result: StatusPedido) => {
      if (result && result.id !== pedido.statusPedido.id) {
        this.pedidoService.changeStatus(pedido.id, result).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Status do pedido atualizado com sucesso!');
            this.loadPedidos()
          },
          error: (err) => {
            console.error('Erro ao atualizar status do pedido:', err);
            this.snackbarService.showError('Erro ao atualizar status do pedido.')
          }
        });
      }
    })
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
