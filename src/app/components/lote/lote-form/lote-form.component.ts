import { CommonModule, NgIf } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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
import { HttpErrorResponse } from '@angular/common/http';

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
      this.fornecedores = data.results;
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
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const lote = this.formGroup.value;
      const operacao =
        lote.id == null
          ? this.loteService.create(lote)
          : this.loteService.update(lote);

      operacao.subscribe({
        next: () => {
          console.log('Lote salvo com sucesso');
          this.router.navigateByUrl('/lotes');
          this.snackbarService.showSuccess('Lote salvo com sucesso');
        },
        error: (err) => {
          console.log('Erro ao salvar o lote' + JSON.stringify(err));
          this.tratarErros(err);
          this.snackbarService.showError('Erro ao salvar lote');
        },
      });
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      }
    } else if (httpError.status < 500) {
      this.snackbarService.showError(
        httpError.error?.message || 'Erro genérico no envio do formulário'
      );
    } else {
      this.snackbarService.showError(
        httpError.error?.message || 'Erro não mapeado do servidor'
      );
    }
  }

  getErrorMessage(
    controlName: string,
    errors: ValidationErrors | null | undefined
  ): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for (const errorName in errors) {
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    codigo: {
      required: 'O nome código ser informado.',
      apiError: ' ',
    },
    data: {
      required: 'A data deve ser informada.',
      apiError: ' ',
    },
    estoque:{
      required: 'O estoque deve ser informado.',
      apiError: ' ',
    },
    forncedor: {
      required: 'O forncedor deve ser informado.',
      apiError: ' ',
    },
    processador: {
      required: 'O processador deve ser informado.',
      apiError: ' ',
    }
  };

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
