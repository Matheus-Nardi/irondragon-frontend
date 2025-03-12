import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-estado-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css',
})
export class EstadoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acoes'];
  estados: Estado[] = [];

  //
  dataSource = new MatTableDataSource<Estado>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //Para injeção de dependencia e declarar variaveis
  constructor(
    private estadoService: EstadoService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}

  // Entender o subscribe
  // Para a inicialização do componente - Lógica de Inicialização
  ngOnInit(): void {
    this.estadoService.getEstados().subscribe((data) => {
      this.estados = data;
      this.dataSource.data = this.estados;
    });
  }

  onDeleteEstado(estado: Estado) {
    this.dialogService.openConfirmDialog(
      'Deletar Estado',
      'Você realmente deseja deletar este estado?',
      'warning'
    ).subscribe(result => {
      if (result) {
        this.deleteEstado(estado);
      }
    });
  }

  deleteEstado(estado: Estado): void {
    this.estadoService.delete(estado).subscribe({
      next: () => {
        console.log('Estado deletado com sucesso');
        this.snackbarService.showSuccess('Estado deletado com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao deletar o estado', err);
      },
    });
  }
}
