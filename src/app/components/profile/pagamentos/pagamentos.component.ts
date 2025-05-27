import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cartao } from '../../../models/cartao.model';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';
import { NgIf, NgFor, TitleCasePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BandeiraCartao } from '../../../models/bandeira-cartao.model';
import { TipoCartao } from '../../../models/tipo-cartao.model';

@Component({
  selector: 'app-pagamentos',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    NgFor,
    TitleCasePipe,
    NgClass,
  ],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.css',
})
export class PagamentosComponent {
  @Input() cliente!: Cliente;
  @Input() usuario!: Usuario;
  @Input() cartoes: Cartao[] = [];

  @Output() abrirModal = new EventEmitter<Cartao | null>();
  @Output() deletar = new EventEmitter<Cartao>();

  constructor() {}

  novoCartao() {
    this.abrirModal.emit(null);
  }

  editarCartao(cartao: Cartao) {
    this.abrirModal.emit(cartao);
  }

  onDeleteCartao(cartao: Cartao) {
    this.deletar.emit(cartao);
  }

  formatCardNumber(numero: string): string {
    if (!numero) return '•••• •••• •••• ••••';
    return `•••• •••• •••• ${numero.slice(-4)}`;
  }

  getLastFourDigits(numero: string): string {
    return numero ? numero.slice(-4) : '••••';
  }

  formatValidade(validade: string | Date): string {
    if (!validade) return 'MM/AA';
    const date = new Date(validade);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substring(2);
    return `${month}/${year}`;
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

  getBandeiraLabel(bandeira: BandeiraCartao): string {
    return bandeira?.label || 'Desconhecida';
  }

  getTipoLabel(tipo: TipoCartao): string {
    
    const map: { [key: string]: string } = {
      Credito: 'Crédito',
      Debito: 'Débito',
    };

    return map[tipo?.label] || 'Não reconhecido';
  }
}
