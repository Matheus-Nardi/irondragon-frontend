import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Fabricante } from '../../../models/fabricante.model';
import { FabricanteService } from '../../../services/fabricante.service';

@Component({
  selector: 'app-fabricante-list',
  imports: [MatPaginator, MatPaginatorModule, MatTableModule],
  templateUrl: './fabricante-list.component.html',
  styleUrl: './fabricante-list.component.css'
})
export class FabricanteListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "nome", "email"];
  fabricantes: Fabricante[] = [];

  dataSource = new MatTableDataSource<Fabricante>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fabricanteService: FabricanteService) {}
  
  ngOnInit(): void {
    this.fabricanteService.findAll().subscribe(data => {
      this.fabricantes = data;
      this.dataSource.data = this.fabricantes;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
