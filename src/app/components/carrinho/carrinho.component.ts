import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ItemCarrinho } from '../../interfaces/item-carrinho.interface';
import { CarrinhoService } from '../../services/carrinho.service';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Processador } from '../../models/processador/processador.model';
import { ProcessadorService } from '../../services/processador.service';
import { ItemPedido } from '../../models/item-pedido.model';

@Component({
  selector: 'app-carrinho',
  imports: [NgFor, NgIf, RouterLink, MatIconModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent {
  carrinhoItens: ItemCarrinho[] = [];

  constructor(
    private carrinhoService: CarrinhoService,
    private processadorService: ProcessadorService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinhoItens = itens;
      console.log(this.carrinhoItens);

    });
  }

  adicionarUnidade(item: ItemCarrinho): void {
    this.carrinhoService.adicionar({ ...item, quantidade: 1 });
  }

  removerUnidade(item: ItemCarrinho): void {
    this.carrinhoService.remover(item);
  }

  removerItem(item: ItemCarrinho): void {
    this.carrinhoService.removerItem(item);
  }

  calcularTotal(): number {
    return this.carrinhoItens.map(a => a.preco * a.quantidade).reduce((a, c) => a + c);
  }

  getTotalItens(): number {
    let count: number = 0;

    for (let i = 0; i < this.carrinhoItens.length; i++) {
      count += this.carrinhoItens[i].quantidade;
    }

    return count;
  }

  finalizarCompra() {

  }

  getImagemUrl(item: ItemCarrinho): string {
    return this.processadorService.getUrlImage(item.id.toString(), item.imagem);
  }
}