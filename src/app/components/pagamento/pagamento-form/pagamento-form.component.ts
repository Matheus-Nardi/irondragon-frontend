import { NgIf, NgFor, TitleCasePipe, NgClass } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule, MatRadioChange } from "@angular/material/radio";
import { MatStepper, MatStepperModule, StepState } from "@angular/material/stepper";
import { RouterLink } from "@angular/router";
import { ItemCarrinho } from "../../../interfaces/item-carrinho.interface";
import { Cartao } from "../../../models/cartao.model";
import { CarrinhoService } from "../../../services/carrinho.service";
import { CartaoService } from "../../../services/cartao.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Endereco } from "../../../models/endereco/endereco.model";
import { EnderecoService } from "../../../services/endereco.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { EnderecoFormModalComponent } from "../../endereco-form-modal/endereco-form-modal.component";
import { SnackbarService } from "../../../services/snackbar.service";
import { BandeiraCartao } from "../../../models/bandeira-cartao.model";
import { CartaoFormModalComponent } from "../../cartao-form-modal/cartao-form-modal.component";
import { PedidoService } from "../../../services/pedido.service";
import { Pedido } from "../../../models/pedido.model";
import { ItemPedido } from "../../../models/item-pedido.model";

@Component({
  selector: 'app-pagamento',
  imports: [
    MatIconModule,
    NgIf,
    NgFor,
    RouterLink,
    MatStepperModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    TitleCasePipe,
    NgClass
  ],
  templateUrl: './pagamento-form.component.html',
  styleUrl: './pagamento-form.component.css'
})
export class PagamentoComponent implements OnInit {


  carrinhoItens: ItemCarrinho[] = [];
  formaPagamento: string = "";
  selectedCard: number = 0;
  selectedEndereco: number = 0;
  cartoes: Cartao[] = [];
  enderecos: Endereco[] = [];

  constructor(
    private carrinhoService: CarrinhoService,
    private cartaoService: CartaoService,
    private enderecoService: EnderecoService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private pedidoService: PedidoService
  ) {

  }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe((data) => {
      this.carrinhoItens = data;
    });

    this.cartaoService.getByUsuario().subscribe((data) => {
      this.cartoes = data;
    });

    this.loadEnderecos();
  }

  loadEnderecos() {
    this.enderecoService.getByUsuario().subscribe((enderecos) => {
      this.enderecos = enderecos;
    });
  }

    loadCartoes() {
    this.cartaoService.getByUsuario().subscribe((cartoes) => {
      this.cartoes = cartoes;
    });
  }

  calcularTotal(): number {
    return this.carrinhoItens.map(a => a.preco * a.quantidade).reduce((a, c) => a + c);
  }

  selectCard(event: MatRadioChange) {
    this.selectedCard = event.value;
  }

  getBandeiraClass(bandeira: BandeiraCartao): string {
    const map: { [key: string]: string } = {
      Visa: 'visa',
      Mastercard: 'mastercard',
      Elo: 'elo',
      'American Express': 'amex',
      Hipercard: 'hipercard',
      'Diners Club': 'diners',
      Discover: 'discover',
      Desconhecida: 'desconhecida',
    };

    return map[bandeira?.label] || 'desconhecida';
  }

  getBandeiraIcon(bandeira: BandeiraCartao): string {
    const icons: { [key: string]: string } = {
      Visa: 'credit_card',
      Mastercard: 'credit_card',
      Elo: 'credit_card',
      'American Express': 'credit_card',
      Hipercard: 'credit_card',
      'Diners Club': 'credit_card',
      Discover: 'credit_card',
      Desconhecida: 'help',
    };

    return icons[bandeira?.label] || 'help';
  }

  formatCardNumber(numero: string): string {
    if (!numero) return '•••• •••• •••• ••••';
    return `•••• •••• •••• ${numero.slice(-4)}`;
  }

  formatDate(date: string | Date): string {
    if (date instanceof Date) {
      return '';
    }
    const parts = date.split('-');

    return parts[1] + '/' + parts[0];
  }

  getTotalItens(): number {
    let count: number = 0;

    for (let i = 0; i < this.carrinhoItens.length; i++) {
      count += this.carrinhoItens[i].quantidade;
    }

    return count;
  }

  onFormaPagamentoChange(event: MatRadioChange) {
    this.formaPagamento = event.value;
  }

  adicionarEndereco() {
    this.dialog.open(EnderecoFormModalComponent, {
      width: '500px',
      data: {} as Partial<Endereco>
    }).afterClosed()
      .subscribe((enderecoAtualizado: Endereco) => {
        if (!enderecoAtualizado) return;
        const operacao$ = enderecoAtualizado.id
          ? this.enderecoService.update(enderecoAtualizado)
          : this.enderecoService.create(enderecoAtualizado);

        operacao$.subscribe({
          next: () => {
            this.snackbarService.showSuccess('Endereço salvo com sucesso');
            this.loadEnderecos();
          },
          error: () => {
            this.snackbarService.showError('Erro ao salvar o endereço');
          },
        });
      });
  }

  adicionarCartao() {
    this.dialog.open(CartaoFormModalComponent, {
       width: '500px',
      data: {} as Partial<Cartao>
    }).afterClosed()
    .subscribe((novoCartao: Cartao) => {
      this.cartaoService.create(novoCartao).subscribe({
         next: () => {
            this.snackbarService.showSuccess('Cartao salvo com sucesso');
            this.loadCartoes();
          },
          error: () => {
            this.snackbarService.showError('Erro ao salvar o cartao');
          },
      })
    })
  }

  selectEndereco(event: MatRadioChange) {
    this.selectedEndereco = event.value;
  }

  finalizarPedido(event: MatStepper): void {
    const pedido = new Pedido();
    pedido.idCartao = this.selectedCard;
    pedido.idEndereco = this.selectedEndereco;
    pedido.tipoPagamento = this.formaPagamento;
    pedido.listaItemPedido = this.carrinhoItens.map(this.converterParaItemPedido);

    if(this.formaPagamento == "cartao") {
      this.pedidoService.create(pedido).subscribe(data => {
        next: () => {
          this.snackbarService.showSuccess('Pagamento concluido');
        }
      });
      return;
    }

    event.next();
  }

  converterParaItemPedido(item: ItemCarrinho): ItemPedido {
    const itemPedido = new ItemPedido();
    itemPedido.quantidade = item.quantidade;
    itemPedido.idProcessador = item.id;

    return itemPedido;
  }
}