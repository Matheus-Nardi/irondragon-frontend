import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Processador } from '../../../models/processador/processador.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { LoteService } from '../../../services/lote.service';
import { ProcessadorService } from '../../../services/processador.service';
import { SnackbarService } from '../../../services/snackbar.service';

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
    MatAutocompleteModule,
  ],

  templateUrl: './lote-form.component.html',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  styleUrl: './lote-form.component.css',
})
export class LoteFormComponent implements OnInit {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  pageSize = 50;
  page = 0;

  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  processadores: Processador[] = [];
  filteredProcessadores!: Observable<Processador[]>;

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
      inputProcessadorControl: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.setupAutocomplete();

    this.fornecedorService.findAll().subscribe((data) => {
      this.fornecedores = data.results;
      this.tryInitializeForm();
    });

    this.processadorService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => {
        this.processadores = data.results;
        this.tryInitializeForm();
      });
  }

  setupAutocomplete(): void {
    this.filteredProcessadores = this.formGroup
      .get('inputProcessadorControl')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value.toLowerCase() : '')),
        map((nome) => this._filterProcessadores(nome))
      );
  }

  private _filterProcessadores(value: string): Processador[] {
    const filterValue = value.toLowerCase();
    return this.processadores.filter((p) =>
      p.nome.toLowerCase().includes(filterValue)
    );
  }

  displayProcessador(processador: Processador): string {
    return processador?.nome ?? '';
  }

  onProcessadorSelected(processador: Processador) {
    this.formGroup.get('processador')?.setValue(processador);
  }

  tryInitializeForm(): void {
    if (this.fornecedores.length === 0 || this.processadores.length === 0) {
      return; // Aguarda os dois carregamentos
    }

    const lote = this.activateRoute.snapshot.data['lote'];
    if (!lote) return;

    const processador = this.processadores.find(
      (p) => p.id === lote?.processador?.id
    );
    const fornecedor = this.fornecedores.find(
      (f) => f.id === lote?.fornecedor?.id
    );

    this.formGroup.patchValue({
      id: lote.id || null,
      codigo: lote.codigo || '',
      estoque: lote.estoque || '',
      data: lote.data || '',
      fornecedor: fornecedor || null,
      processador: processador || null,
      inputProcessadorControl: processador ? processador.nome : '',
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
          this.router.navigateByUrl('/admin/lotes');
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
    estoque: {
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
    },
  };

  excluir() {
    if (this.formGroup.valid) {
      const lote = this.formGroup.value;
      if (lote.id != null) {
        this.loteService.delete(lote).subscribe({
          next: () => {
            console.log('Lote excluido com sucesso');
            this.router.navigateByUrl('/admin/lotes');
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
