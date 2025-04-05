import { CommonModule, NgIf } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Processador } from '../../../models/processador/processador.model';
import { LoteService } from '../../../services/lote.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ProcessadorService } from '../../../services/processador.service';
import { Lote } from '../../../models/lote.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

@Component({
  selector: 'app-lote-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterLink,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],

  templateUrl: './lote-form.component.html',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  styleUrl: './lote-form.component.css',
})
export class LoteFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  processadores: Processador[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loteService: LoteService,
    private fornecedorService: FornecedorService,
    private processadorService: ProcessadorService,
    private router: Router,
    private snackbarService: SnackbarService,
    private activateRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      codigo: ['', Validators.required],
      estoque: ['', Validators.required],
      data: ['', Validators.required],
      fornecedor: [null, Validators.required],
      processador: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe((data) => {
      this.fornecedores = data;
      this.initilizeForm();
    });
    this.processadorService.findAll().subscribe((data) => {
      this.processadores = data;
      this.initilizeForm();
    });
  }

  initilizeForm(): void {
    const lote = this.activateRoute.snapshot.data['lote'];

    const processador = this.processadores.find(
      (p) => p.id === (lote?.processador?.id || null)
    );
    const fornecedor = this.fornecedores.find(
      (f) => f.id === (lote?.fornecedor?.id || null)
    );

    this.formGroup = this.formBuilder.group({
      id: [lote && lote.id ? lote.id : null],
      codigo: [lote && lote.codigo ? lote.codigo : '', Validators.required],
      estoque: [lote && lote.estoque ? lote.estoque : '', Validators.required],
      data: [lote && lote.data ? lote.data : '', Validators.required],
      fornecedor: [fornecedor, Validators.required],
      processador: [processador, Validators.required],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const novoLote = this.formGroup.value;
      if (novoLote.id == null) {
        this.createLote(novoLote);
      } else {
        this.editLote(novoLote);
      }
    }
  }

  private createLote(novoLote: Lote) {
    this.loteService.create(novoLote).subscribe({
      next: (lote) => {
        console.log('Lote cadastrado com sucesso');
        this.router.navigateByUrl('/lotes');
        this.snackbarService.showSuccess('Lote cadastrado com sucesso');
      },
      error: (err) => {
        console.log('Erro ao cadastrar o lote' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao cadastrar lote');
      },
    });
  }

  private editLote(novoLote: Lote) {
    this.loteService.update(novoLote).subscribe({
      next: () => {
        console.log('Lote atualizado com sucesso');
        this.router.navigateByUrl('/lotes');
        this.snackbarService.showSuccess('Lote atualizado com sucesso');
      },
      error: (err) => {
        console.log('Erro ao atualizar o lote' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao autalizar lote');
      },
    });
  }

  excluir() {
    if (this.formGroup.valid) {
      const lote = this.formGroup.value;
      if (lote.id != null) {
        this.loteService.delete(lote).subscribe({
          next: () => {
            console.log('Lote excluido com sucesso');
            this.router.navigateByUrl('/lotes');
            this.snackbarService.showSuccess('Lote deletado com sucesso');
          },
          error: (err) => {
            console.log('Erro ao excluir o lote' + JSON.stringify(err));
            this.snackbarService.showError('Erro ao deletar lote');
          },
        });
      }
    }
  }
}
