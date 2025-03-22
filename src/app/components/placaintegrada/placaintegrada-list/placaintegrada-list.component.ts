import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {PlacaIntegrada} from '../../../models/processador/placaintegrada.model';
import {PlacaintegradaService} from '../../../services/placaintegrada.service';
import {DialogService} from '../../../services/dialog.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
  selector: 'app-placaintegrada-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterLink
  ],
  templateUrl: './placaintegrada-list.component.html',
  styleUrl: './placaintegrada-list.component.css'
})
export class PlacaintegradaListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'nome', 'directX', 'openGl', 'vulkan', 'acoes'];
  placasIntegradas: PlacaIntegrada[] = [];
  dataSource = new MatTableDataSource<PlacaIntegrada>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private placaIntegradaService: PlacaintegradaService,
    private dialogService: DialogService,
    private snackBarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.placaIntegradaService.findAll().subscribe((data) => {
      this.placasIntegradas = data;
      this.dataSource.data = this.placasIntegradas;

      this.changeDetectorRef.detectChanges();
      this.dataSource.paginator = this.paginator;
    });
  }

  onDeletePlacaIntegrada(placaIntegrada: PlacaIntegrada) {
    this.dialogService.openConfirmDialog(
      `Deletar ${placaIntegrada.nome}`,
      'Ao clicar em confirmar, você estará deletando para sempre dos registros. Essa ação é irreversivel',
      'warning'
    ).subscribe((result) => {
      if(result) {
        this.placaIntegradaService.delete(placaIntegrada).subscribe({
          next: () => {
            this.snackBarService.showSuccess('Placa Integrada deletada com sucesso!');
            console.log(`Placa Integrada deletada com sucesso!`);
            this.ngOnInit()
          },
          error: (err) => {
            console.error('Erro ao deletar a placa integrada', err);
          }
        });
      }
    });
  }
}
