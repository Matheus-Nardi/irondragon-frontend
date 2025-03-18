import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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

  constructor(
    private cidadeService: CidadeService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  dataSource = new MatTableDataSource<Cidade>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this.cidadeService.findAll().subscribe((data) => {
      this.cidades = data;
      this.dataSource.data = this.cidades;

      this.changeDetectorRef.detectChanges();
      this.dataSource.paginator = this.paginator;
    });
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
