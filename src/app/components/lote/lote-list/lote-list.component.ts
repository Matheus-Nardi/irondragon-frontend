import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Lote } from '../../../models/lote.model';
import { DialogService } from '../../../services/dialog.service';
import { LoteService } from '../../../services/lote.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lote-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './lote-list.component.html',
  styleUrl: './lote-list.component.css',
})
export class LoteListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'codigo',
    'processador',
    'estoque',
    'fornecedor',
    'data',
    'acoes',
  ];
  search: string = '';
  lotes: Lote[] = [];
  lotesFiltrados: Lote[] = [];
  totalRecords = 0;
  pageSize = 100;
  page = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private loteService: LoteService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loadLotes();
  }

  loadLotes(): void {
    this.loteService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.lotes = data.results;
      this.totalRecords = data.count;
      this.lotesFiltrados = [...this.lotes];
    });
  }

   paginar(event: PageEvent): void {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadLotes();
    }

  onDeleteLote(lote: Lote) {
    this.dialogService
      .openConfirmDialog(
        'Deletar Lote',
        'Você realmente deseja deletar este lote?',
        'warning'
      )
      .subscribe((result) => {
        if (result) {
          this.deleteLote(lote);
        }
      });
  }

  deleteLote(lote: Lote): void {
    this.loteService.delete(lote).subscribe({
      next: () => {
        console.log('Lote deletado com sucesso');
        this.snackbarService.showSuccess('Lote deletado com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao deletar o lote', err);
      },
    });
  }

  onSearch(value: string): void {
    this.page = 0;
  
    if (value.trim() === '') {
      this.lotesFiltrados = [...this.lotes];
      this.totalRecords = this.lotesFiltrados.length;
      return;
    }
  
    const searchValue = value.toLowerCase();
    this.lotesFiltrados = this.lotes.filter(lote =>
      lote.codigo.toLowerCase().includes(searchValue) 
    );
  
    this.totalRecords = this.lotesFiltrados.length;
  }
  
}
