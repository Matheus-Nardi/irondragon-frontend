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
  constructor(private processadorService: ProcessadorService) {}
  //Preciso receber o usuario/cliente para obter a lista de desejos
  @Input() cliente!: Cliente;
  @Input() usuario!: Usuario;

  @Input() listaDesejos: Processador[] = [];

  @Output() remover = new EventEmitter<Processador>();

  getImagemUrl(processador: Processador): string {
    return this.processadorService.getUrlImage(
      processador.id.toString(),
      processador.imagens[0]
    );
  }

  onRemoverDesejo(processador: Processador) {
    this.remover.emit(processador);
  }
}
