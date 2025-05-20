import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Endereco } from '../../../models/endereco/endereco.model';
import { EnderecoFormModalComponent } from '../../endereco-form-modal/endereco-form-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-enderecos-usuario',
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgIf, NgFor],
  templateUrl: './enderecos-usuario.component.html',
  styleUrl: './enderecos-usuario.component.css',
})
export class EnderecosUsuarioComponent {

  @Input() cliente!: Cliente;
  @Input() usuario!: Usuario;

  @Input() enderecos: Endereco[] = []; // lista de endereços para exibir

  @Output() abrirModal = new EventEmitter<Endereco | null>(); // notifica o pai para abrir modal
  @Output() deletar = new EventEmitter<Endereco>(); // notifica o pai para deletar endereço

  constructor() {}

  novoEndereco() {
    this.abrirModal.emit(null);
  }

  editarEndereco(endereco: Endereco) {
    this.abrirModal.emit(endereco);
  }

  onDeleteEndereco(endereco: Endereco) {
    this.deletar.emit(endereco);
  }
}
