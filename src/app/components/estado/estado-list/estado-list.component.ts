import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-estado-list',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css'
})

export class EstadoListComponent implements OnInit {
  estados: Estado[] = [];

  //Para injeção de dependencia e declarar variaveis
  constructor(private estadoService: EstadoService) { }

  // Entender o subscribe
  // Para a inicialização do componente - Lógica de Inicialização
  ngOnInit(): void {
    this.estadoService.getEstados().subscribe(data => {
      this.estados = data;
    })
  }




}
