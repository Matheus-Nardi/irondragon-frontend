import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-estado-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css',
})
export class EstadoListComponent implements OnInit {
  search: string = '';
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acoes'];
  estados: Estado[] = [];
  estadosFiltrados: Estado[] = [];
  totalRecords = 0;
  pageSize = 5;
  page = 0;

  //Para injeção de dependencia e declarar variaveis
  constructor(
    private estadoService: EstadoService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    
  ) { }

  ngOnInit(): void {
    this.loadEstados();
  }
  
  loadEstados(): void {
    this.estadoService.findAll(this.page, this.pageSize).subscribe(data => {
      console.log(data);
      this.estados = data.results;
      this.totalRecords = data.count;
      this.estadosFiltrados = [...this.estados];
    });
  }
  
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEstados();
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

  onSearch(value: string): void {
    this.page = 0;
    if (value.trim() === '') {
      this.estadosFiltrados = [...this.estados]; 
      this.totalRecords = this.estados.length;
      return;
    }
  
    this.estadoService.findByNome(value, this.page, this.pageSize).subscribe(data => {
      this.estadosFiltrados = data.results;
      this.totalRecords = data.count;
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
