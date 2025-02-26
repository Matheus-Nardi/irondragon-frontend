import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';

@Component({
  selector: 'app-cidade-list',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './cidade-list.component.html',
  styleUrl: './cidade-list.component.css'
})
export class CidadeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'estado'];
  cidades: Cidade[] = [];

  constructor(private readonly cidadeService: CidadeService) { }
  dataSource = new MatTableDataSource<Cidade>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this.cidadeService.getCidades().subscribe(data => {
      this.cidades = data;
      this.dataSource.data = this.cidades;
    })
  }
}
