import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Route, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

@Component({
  selector: 'app-cadastro',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgIf,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
  ],
  templateUrl: './cadastro.component.html',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent {
  formGroup: FormGroup;
  mostrarSenha = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group(
      {
        nome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required]],
        dataNascimento: ['', [Validators.required]],
        confirmarSenha: ['', [Validators.required]],
        cpf: ['', [Validators.required]],
        telefone: this.formBuilder.group({
          codigoArea: [
            '',
            [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(2),
            ],
          ],
          numero: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]],
        }),
      },
      {
        validators: [this.confirmarSenhasIguais()], // Validador customizado
      }
    );
  }

  cadastrar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value;
      this.usuarioService.create(usuario).subscribe({
        next: () => {
          console.log('Cadastro realizado com sucesso');
          this.snackbarService.showSuccess('Cadastro realizado com sucesso');
          // redirecionar para tela de login
        },

        error: () => {
          console.log('Cadastro não foi realizado com sucesso');
          this.snackbarService.showError('Cadastro inválido');
        },
      });
    }
  }

  private confirmarSenhasIguais() {
    return (group: FormGroup): ValidationErrors | null => {
      const senha = group.get('senha')?.value;
      const confirmarSenha = group.get('confirmarSenha')?.value;
      if (senha && confirmarSenha && senha !== confirmarSenha) {
        group.get('confirmarSenha')?.setErrors({ mismatch: true });
        return { mismatch: true };
      }
      return null;
    };
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
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
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' ',
    },
    email: {
      required: 'O email deve ser informado.',
      email: 'O email deve estar em um fomato válido',
      apiError: ' ',
    },
    cpf: {
      required: 'O cpf deve ser informado.',
      apiError: ' ',
    },
    senha: {
      required: 'A senha deve ser informada',
      apiError: ' ',
    },
    confirmarSenha: {
      required: 'A confirmação de senha é obrigatória',
      mismatch: 'As senhas devem ser iguais',
      apiError: ' ',
    },
    codigoArea: {
      required: 'O código de área deve ser informado.',
      minlength: 'O código de área deve ter 2 dígitos.',
      maxlength: 'O código de área deve ter 2 dígitos.',
      apiError: ' ',
    },
    numero: {
      required: 'O número deve ser informado.',
      pattern: 'O número deve conter entre 8 e 9 dígitos numéricos.',
      apiError: ' ',
    },
    dataNascimento: {
      required: 'A data de nascimento deve ser informada.',
      apiError: ' ',
    },
  };
}
