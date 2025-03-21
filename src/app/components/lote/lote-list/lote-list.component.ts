import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Lote } from '../../../models/lote.model';
import { DialogService } from '../../../services/dialog.service';
import { LoteService } from '../../../services/lote.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lote-list',
  imports: [ MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ],
  templateUrl: './lote-list.component.html',
  styleUrl: './lote-list.component.css'
})
export class LoteListComponent  implements OnInit {

  displayedColumns: string[] = ['id', 'codigo', 'processador', 'estoque' , 'fornecedor', 'data' ,'acoes'];
    lotes: Lote[] = [];
    dataSource = new MatTableDataSource<Lote>();
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(
      private loteService: LoteService,
      private dialogService: DialogService,
      private snackbarService: SnackbarService,
      private changeDetectorRef: ChangeDetectorRef
    ) {}
  
    // Entender o subscribe
    // Para a inicialização do componente - Lógica de Inicialização
    ngOnInit(): void {
      this.loteService.findAll().subscribe((data) => {
        this.lotes = data;
        this.dataSource.data = this.lotes;
  
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
      });
    }
  
    onDeleteLote(lote: Lote) {
      this.dialogService.openConfirmDialog(
        'Deletar Lote',
        'Você realmente deseja deletar este lote?',
        'warning'
      ).subscribe(result => {
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
}
