import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Fabricante } from '../../../models/fabricante.model';
import { FabricanteService } from '../../../services/fabricante.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-fabricante-list',
  imports: [MatPaginator, MatPaginatorModule, MatTableModule, MatIconModule, MatButtonModule, RouterLink, MatDialogModule],
  templateUrl: './fabricante-list.component.html',
  styleUrl: './fabricante-list.component.css'
})
export class FabricanteListComponent implements OnInit, AfterViewInit {

  
 
  fabricantes: Fabricante[] = [];
  dataSource = new MatTableDataSource<Fabricante>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

 

  constructor(private fabricanteService: FabricanteService,  private dialogService: DialogService, private snackbarService: SnackbarService) {}
  
  
  ngOnInit(): void {
    this.fabricanteService.findAll().subscribe(data => {
      this.fabricantes = data;
      this.dataSource.data = this.fabricantes;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  

  displayedColumns: string[] = ["id", "nome", "email", "telefone", "acoes"];


 

  onDeleteFabricante(fabricante: Fabricante): void {
    this.dialogService.openConfirmDialog(
      'Deletar Fabricante',
      'Você realmente deseja deletar este fabricante?',
      'warning'
    ).subscribe(result => {
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
