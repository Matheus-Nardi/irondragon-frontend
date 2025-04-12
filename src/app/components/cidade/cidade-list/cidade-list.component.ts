import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { DialogService } from '../../../services/dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cidade-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './cidade-list.component.html',
  styleUrl: './cidade-list.component.css',
})
export class CidadeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'estado', 'acoes'];
  cidades: Cidade[] = [];
  cidadesFiltradas: Cidade[] = [];
  search: string = '';

  totalRecords: number = 0;
  page: number = 0;
  pageSize: number = 5;

  constructor(
    private cidadeService: CidadeService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadCidades();
  }

  loadCidades(): void {
    this.cidadeService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.cidades = data.results;
      this.totalRecords = data.count;
      this.cidadesFiltradas = [...this.cidades];
    });
  }

  pagination(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCidades();
  }

  onDeleteCidade(cidade: Cidade) {
    this.dialogService
      .openConfirmDialog(
        `Deletar ${cidade.nome}?`,
        `Ao clicar em confirmar, você estará deletando para sempre dos registros. Essa ação é irreversivel`,
        'warning'
      )
      .subscribe((result) => {
        if (result) {
          this.deleteCidade(cidade);
        }
      });
  }

  onSearch(value: string): void {
    this.page = 0;
    if (value.trim() === '') {
      this.cidadesFiltradas = [...this.cidades];
      this.totalRecords = this.cidades.length;
      return;
    }

    this.cidadeService
      .findByNome(value, this.page, this.pageSize)
      .subscribe((data) => {
        this.cidadesFiltradas = data.results;
        this.totalRecords = data.count;
      });
  }

  deleteCidade(cidade: Cidade) {
    this.cidadeService.delete(cidade).subscribe({
      next: () => {
        console.log('Cidade deletada com sucesso');
        this.snackbarService.showSuccess('Cidade deletada com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao deletar a cidade', err);
      },
    });
  }
}
