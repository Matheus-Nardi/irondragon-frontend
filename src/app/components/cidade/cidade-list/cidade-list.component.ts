import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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

@Component({
  selector: 'app-cidade-list',
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, MatIconModule, MatButtonModule, RouterLink, MatDialogModule, MatCardModule],
  templateUrl: './cidade-list.component.html',
  styleUrl: './cidade-list.component.css',
})
export class CidadeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'estado', 'acoes'];
  cidades: Cidade[] = [];

  totalRecords: number = 0;
  page: number = 0;
  pageSize: number = 5;

  constructor(
    private cidadeService: CidadeService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}
  dataSource = new MatTableDataSource<Cidade>();

  ngOnInit(): void {
    this.loadCidades();
  }

  loadCidades(): void {
    this.cidadeService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.cidades = data.results;
      this.totalRecords = data.count;
      this.dataSource.data = this.cidades;
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
