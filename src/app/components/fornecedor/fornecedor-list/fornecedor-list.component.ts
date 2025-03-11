import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';

@Component({
  selector: 'app-fornecedor-list',
  imports: [MatTableModule, MatPaginatorModule, MatPaginator],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "nome", "email", "telefone"];
  fornecedores: Fornecedor[] = [];

  dataSource = new MatTableDataSource<Fornecedor>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
      this.dataSource.data = this.fornecedores;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
