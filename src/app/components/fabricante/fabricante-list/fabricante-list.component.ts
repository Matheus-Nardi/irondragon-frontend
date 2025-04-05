import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Fabricante } from '../../../models/fabricante.model';
import { FabricanteService } from '../../../services/fabricante.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-fabricante-list',
  imports: [
    MatPaginator,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule,
    FormsModule,
    MatInputModule
  ],
  templateUrl: './fabricante-list.component.html',
  styleUrl: './fabricante-list.component.css',
})
export class FabricanteListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'acoes'];
  fabricantes: Fabricante[] = [];
  fabricantesFiltrados: Fabricante[] = [];
  totalRecords = 0;
  pageSize = 5;
  page = 0;
  search: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fabricanteService: FabricanteService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
     this.loadFabricantes();
   }
   
   loadFabricantes(): void {
     this.fabricanteService.findAll(this.page, this.pageSize).subscribe(data => {
       this.fabricantes = data.results;
       this.totalRecords = data.count;
       this.fabricantesFiltrados = [...this.fabricantes];
     });
   }
   
   paginar(event: PageEvent): void {
     this.page = event.pageIndex;
     this.pageSize = event.pageSize;
     this.loadFabricantes();
   }

   onSearch(value: string): void {
    this.page = 0;
    if (value.trim() === '') {
      this.fabricantesFiltrados = [...this.fabricantes]; 
      this.totalRecords = this.fabricantes.length;
      return;
    }
  
    this.fabricanteService.findByNome(value, this.page, this.pageSize).subscribe(data => {
      this.fabricantesFiltrados = data.results;
      this.totalRecords = data.count;
    });
  }

  onDeleteFabricante(fabricante: Fabricante): void {
    this.dialogService
      .openConfirmDialog(
        'Deletar Fabricante',
        'Você realmente deseja deletar este fabricante?',
        'warning'
      )
      .subscribe((result) => {
        if (result) {
          this.deletefabricante(fabricante);
        }
      });
  }

  deletefabricante(fabricante: Fabricante): void {
    this.fabricanteService.delete(fabricante).subscribe({
      next: () => {
        console.log('Fabricante deletado com sucesso');
        this.snackbarService.showSuccess('Fabricante deletado com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao deletar o fabricante', err);
      },
    });
  }
}
