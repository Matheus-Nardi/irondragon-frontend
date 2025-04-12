import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Processador } from '../../../models/processador/processador.model';
import { ProcessadorService } from '../../../services/processador.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';
import { DialogService } from '../../../services/dialog.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-processador-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './processador-list.component.html',
  styleUrl: './processador-list.component.css'
})
export class ProcessadorListComponent {
  displayedColumns: string[] = ['id', 'nome', 'socket', 'threads', 'nucleos', 'desbloqueado', 'preco', 'placa', 'acoes'];
  processadores: Processador[] = [];
  processadoresFiltrados: Processador[] = [];
  dataSource = new MatTableDataSource<Processador>();
  search: string = '';

  totalRecords: number = 0;
  page: number = 0;
  pageSize: number = 5;

  constructor(
    private processadorService: ProcessadorService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService
  ) {

  }

  ngOnInit(): void {
    this.loadProcessadores();
  }

  loadProcessadores(): void {
    this.processadorService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.processadores = data.results;
      this.totalRecords = data.count;
      this.dataSource.data = this.processadores;
      this.processadoresFiltrados = [...this.processadores];
    })
  }

  pagination(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProcessadores();
  }

  onSearch(value: string): void {
    this.page = 0;

    if(value.trim() === '') {
      this.processadoresFiltrados = [...this.processadores];
      this.totalRecords = this.processadoresFiltrados.length;
      return;
    }

    const searchValue = value.toLowerCase();
    this.processadoresFiltrados = this.processadores.filter(p => {
      return p.nome.toLowerCase().includes(searchValue);
    });

    this.totalRecords = this.processadoresFiltrados.length;
  }

  onDeleteProcessador(processador: Processador) {
    this.dialogService.openConfirmDialog(
      `Deletar ${processador.nome}?`,
      'Está ação é irreversivel',
      'warning'
    )
    .subscribe((result) => {
      if(result) {
        this.deleteProcessador(processador);
      }
    })
  }

  deleteProcessador(processador: Processador) {
    this.processadorService.delete(processador).subscribe({
      next: () => {
        console.log('Processador deletado com sucesso!');
        this.snackbarService.showSuccess('Processador deletado com sucesso!');
        this.loadProcessadores();
      } ,
      error: (err) => {
        console.error('Erro ao deletar processador' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao deletar processador');
      }
    })
  }
}
