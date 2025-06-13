import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  Location,
} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido.model';
import { HeaderComponent } from '../../../template/header/header.component';
import { FooterComponent } from '../../../template/footer/footer.component';
import { ProcessadorService } from '../../../../services/processador.service';
import { Endereco } from '../../../../models/endereco/endereco.model';
import { DialogService } from '../../../../services/dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PagamentoService } from '../../../../services/pagamento.service';

@Component({
  selector: 'app-pedidos-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    CurrencyPipe,
    DatePipe,
    HeaderComponent,
    FooterComponent,
    MatTooltipModule,
  ],
  templateUrl: './pedidos-details.component.html',
  styleUrl: './pedidos-details.component.css',
})
export class PedidosDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private pagamentoService: PagamentoService,
    private router: Router,
    private location: Location,
    private processadorService: ProcessadorService,
    private dialogService: DialogService
  ) {}

  pedido!: Pedido;
  endereco!: Endereco;
  processadorImagens: { [id: number]: string } = {};
  tipoPagamento: 'Pix' | 'Boleto' | 'Cartão' | '' = '';

  ngOnInit(): void {
    this.loadPedido();
  }

  private loadPedido() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarPedido(+id);
    } else {
      this.router.navigate(['/perfil/pedidos']);
    }
  }

  carregarPedido(id: number): void {
    this.pedidoService.findById(id.toString()).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        const tipo = pedido.pagamento.tipoPagamento;
        if (tipo === 'Pix' || tipo === 'Boleto' || tipo === 'Cartão') {
          this.tipoPagamento = tipo;
        } else {
          this.tipoPagamento = '';
        }
        console.log(pedido);
        // Para cada item, busque a imagem
        pedido.listaItemPedido.forEach((item) => {
          this.processadorService
            .findById(item.idProcessador.toString())
            .subscribe({
              next: (processadorData) => {
                this.processadorImagens[item.idProcessador] =
                  this.processadorService.getUrlImage(
                    processadorData.id.toString(),
                    processadorData.imagens.find((img) => img.principal)
                      ?.imagem || ''
                  );
              },

              error: (error) => {
                console.error('Erro ao carregar processador:', error);
              },
            });
        });
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        this.router.navigate(['/perfil/pedidos']);
      },
    });
  }

  getImagemProcessador(idProcessador: number): string {
    return this.processadorImagens[idProcessador] || '';
  }

  get enderecosCliente(): any[] {
    return this.pedido?.cliente?.usuario?.enderecos ?? [];
  }

  voltarParaPedidos(): void {
    this.location.back();
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

  getPagamentoStatus(pago: boolean): string {
    return pago ? 'Pago' : 'Pendente';
  }

  getPagamentoClass(pago: boolean): string {
    return pago ? 'payment-paid' : 'payment-pending';
  }

  private cancelarPedido(id: number, callback?: () => void): void {
    this.pedidoService.cancel(id).subscribe({
      next: () => {
        console.log('Pedido #', id, 'cancelado');
        if (callback) {
          callback();
        }
      },
      error: () => {
        console.error('Erro ao cancelar o pedido!');
      },
    });
  }

  onCancelarPedido(id: number): void {
    this.dialogService
      .openConfirmDialog(
        'Deletar pedido ?',
        'Ao clicar em confirmar, você estará cancelando o seu pedido. Essa ação é irreversível',
        'delete'
      )
      .subscribe((result) => {
        if (result) {
          this.cancelarPedido(id, () => {
            this.carregarPedido(id); // só recarrega após cancelamento ser concluído
          });
        }
      });
  }

onPagarPedido(pedido: Pedido): void {
  const idPedido: number = pedido.id;
  
  switch (pedido.pagamento.tipoPagamento) {
    case 'Boleto':
      this.pagarComBoleto(idPedido, pedido.pagamento.id);
      break;
      
    case 'Pix':
      this.pagarComPix(idPedido, pedido.pagamento.id);
      break;
    default:
      console.warn('Tipo de pagamento não suportado:', pedido.pagamento.tipoPagamento);
      break;
  }
}

  private pagarComBoleto(idPedido: number, idBoleto: number): void {
  this.pagamentoService.boletoPayment(idBoleto, idPedido).subscribe({
    next: (response) => {
      console.log('Boleto pago com sucesso:', response);
      this.loadPedido(); // Recarregar pedido
    },
    error: (error) => {
      console.error('Erro ao pagar boleto:', error);
     
    },
  });
}

private pagarComPix(idPedido: number, idPix: number): void {
  this.pagamentoService.pixPayment(idPix, idPedido).subscribe({
    next: (response) => {
      console.log('PIX pago com sucesso:', response);
      this.loadPedido(); // Recarregar pedido
    },
    error: (error) => {
      console.error('Erro ao pagar PIX:', error);
    
    },
  });
}
}
