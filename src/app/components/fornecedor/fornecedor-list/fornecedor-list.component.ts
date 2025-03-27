import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { DialogService } from '../../../services/dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-fornecedor-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule,
  ],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css',
})
export class FornecedorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'acoes'];
  fornecedores: Fornecedor[] = [];
  totalRecords = 0;
  pageSize = 5;
  page = 0;

  dataSource = new MatTableDataSource<Fornecedor>();

  constructor(
    private fornecedorService: FornecedorService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,    
  ) {}

  ngOnInit(): void {
    this.loadFornecedores();
  }

  loadFornecedores() {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.fornecedores = data.results;
      this.totalRecords = data.count;
      this.dataSource.data = this.fornecedores;
    });
  }

  pagination(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFornecedores();
  }

  onDeleteFornecedor(fornecedor: Fornecedor) {
    this.dialogService
      .openConfirmDialog(
        `Deletar ${fornecedor.nome}?`,
        `Ao clicar em confirmar, você estará deletando para sempre dos registros. Essa ação é irreversivel`,
        'warning'
      )
      .subscribe((result) => {
        if (result) {
          this.deleteFornecedor(fornecedor);
        }
      });
  }

  deleteFornecedor(fornecedor: Fornecedor) {
    this.fornecedorService.delete(fornecedor).subscribe({
      next: () => {
        console.log('Fornecedor deletado com sucesso');
        this.snackbarService.showSuccess('Fornecedor deletado com sucesso');
        this.loadFornecedores();
      },
      error: (err) => {
        console.error('Erro ao deletar o fornecedor', err);
      },
    });
  }
}
