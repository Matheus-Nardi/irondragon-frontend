import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-estado-list',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css'
})

export class EstadoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'sigla'];
  estados: Estado[] = [];

  //
  dataSource = new MatTableDataSource<Estado>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //Para injeção de dependencia e declarar variaveis
  constructor(private estadoService: EstadoService) { }

  // Entender o subscribe
  // Para a inicialização do componente - Lógica de Inicialização
  ngOnInit(): void {
    this.estadoService.getEstados().subscribe(data => {
      this.estados = data;
      this.dataSource.data = this.estados;
    })
  }

  




}
