import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cartao } from '../../models/cartao.model';
import { SnackbarService } from '../../services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { TipoCartao } from '../../models/tipo-cartao.model';

@Component({
  selector: 'app-cartao-form-modal',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './cartao-form-modal.component.html',
  styleUrl: './cartao-form-modal.component.css',
})
export class CartaoFormModalComponent implements OnInit {
  formCartao!: FormGroup;

  tiposCartao: TipoCartao[] = [
  { id: 1, label: 'Crédito' },
  { id: 2, label: 'Débito' },
];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CartaoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public cartao: Partial<Cartao> = {},
    private snackbarService: SnackbarService
  ) {}

  //Adicionar formas de formatar ao mesmo tempo que digita
  ngOnInit(): void {
    this.formCartao = this.fb.group({
      id: [this.cartao.id || null],
      nomeTitular: [this.cartao.nomeTitular || '', Validators.required],
      cpf: [
        this.cartao.cpf || '',
        [
          Validators.required,
        ],
      ],
      numero: [
        this.cartao.numero || '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/),
        ],
      ],
      cvc: [
        this.cartao.cvc || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(4),
          Validators.pattern(/^\d+$/),
        ],
      ],
      validade: [this.cartao.validade || '', [Validators.required]],
      tipoCartao: [this.cartao.tipo?.id || null, Validators.required],
    });
  }

  salvar() {
    this.formCartao.markAllAsTouched();
    if (this.formCartao.valid) {
      console.log(this.formCartao.value);
      const cartaoForm = this.formCartao.value;

      const cartao = new Cartao();
      cartao.id = cartaoForm.id;
      cartao.nomeTitular = cartaoForm.nomeTitular;
      cartao.cpf = cartaoForm.cpf;
      cartao.cvc = cartaoForm.cvc;
      cartao.validade = cartaoForm.validade;
      cartao.tipo = cartaoForm.tipoCartao;
      cartao.numero = cartaoForm.numero;

      this.dialogRef.close(cartao);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formCartao.get(validationError.fieldName);
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
    nomeTitular: {
      required: 'O nome do titular deve ser informado.',
      apiError: ' ',
    },
    cpf: {
      required: 'O CPF deve ser informado.',
      pattern: 'CPF inválido. Use o formato XXX.XXX.XXX-XX.',
      apiError: ' ',
    },
    numero: {
      required: 'O número do cartão deve ser informado.',
      pattern: 'Número do cartão inválido.',
      apiError: ' ',
    },
    cvc: {
      required: 'O código de segurança (CVC) deve ser informado.',
      minlength: 'O CVC deve ter pelo menos 3 dígitos.',
      maxlength: 'O CVC deve ter no máximo 4 dígitos.',
      pattern: 'CVC deve conter apenas números.',
      apiError: ' ',
    },
    validade: {
      required: 'A data de validade deve ser informada.',
      pattern: 'Data de validade inválida. Use o formato MM/AA.',
      apiError: ' ',
    },
    tipoCartao: {
      required: 'O tipo do cartão deve ser selecionado.',
      apiError: ' ',
    },
  };
}
