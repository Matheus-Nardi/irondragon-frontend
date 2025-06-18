import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';
import { Processador } from '../../../models/processador/processador.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProcessadorService } from '../../../services/processador.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { ItemCarrinho } from '../../../interfaces/item-carrinho.interface';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-lista-desejos',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    RouterLink,
  ],
  templateUrl: './lista-desejos.component.html',
  styleUrl: './lista-desejos.component.css',
})
export class ListaDesejosComponent {
  constructor(
    private processadorService: ProcessadorService,
    private carrinhoService: CarrinhoService,
    private snackbarService: SnackbarService
  ) {}
  //Preciso receber o usuario/cliente para obter a lista de desejos
  @Input() cliente!: Cliente;
  @Input() usuario!: Usuario;

  @Input() listaDesejos: Processador[] = [];

  @Output() remover = new EventEmitter<Processador>();

  getImagemUrl(processador: Processador): string {
    return this.processadorService.getUrlImage(
      processador.id.toString(),
      processador.imagens.find((img) => img.principal)?.imagem || ''
    );
  }

  onRemoverDesejo(processador: Processador) {
    this.remover.emit(processador);
  }

  addToCart(produto: Processador, event: MouseEvent): void {
    event.stopPropagation();

    this.processadorService.findById(produto.id.toString()).subscribe({
      next: (proc) => {
        this.carrinhoService.adicionar({
          id: proc.id,
          nome: proc.nome,
          quantidade: 1,
          preco: proc.preco,
          imagem: proc.imagens.find((img) => img.principal)?.nomeImagem || '',
        });
      },
      error: (err) => {
        console.error('Erro ao buscar processador:', err);
        this.snackbarService.showError(
          'Não foi possível adicionar ao carrinho.'
        );
      },
    });
  }
}
