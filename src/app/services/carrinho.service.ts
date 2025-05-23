import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrinho } from '../interfaces/item-carrinho.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    const carrinhoArmazenado = localStorageService.getItem('carrinho') || [];
    this.carrinhoSubject.next(carrinhoArmazenado);
  }

  adicionar(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(itemCarrinho => itemCarrinho.id === item.id);

    if(itemExistente) {
      itemExistente.quantidade += item.quantidade;
    } else {
      carrinhoAtual.push({... item});
    }

    this.carrinhoSubject.next(carrinhoAtual);
    this.atualizarArmazenamentoLocal();
  }

  remover(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(itemCarrinho => itemCarrinho.id === item.id);

    if(itemExistente) {
      itemExistente.quantidade--;

      if(itemExistente.quantidade === 0) {
        this.removerItem(itemExistente);
      } else {
        this.carrinhoSubject.next(carrinhoAtual);
        this.atualizarArmazenamentoLocal();
      }
    }
  }

  removerItem(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const carrinhoAtualizado = carrinhoAtual.filter(itemCarrinho => itemCarrinho !== item);

    this.carrinhoSubject.next(carrinhoAtualizado);
    this.atualizarArmazenamentoLocal();
  }

  removerTudo(): void {
    this.localStorageService.removeItem('carrinho');
    window.location.reload(); 
  }

  obter(): ItemCarrinho[] {
    return this.carrinhoSubject.value;
  }

  obterTempoReal(): Observable<ItemCarrinho[]> {
    return this.carrinhoSubject.asObservable();
  }

  atualizarArmazenamentoLocal(): void {
    this.localStorageService.setItem('carrinho', this.carrinhoSubject.value);
  }
}