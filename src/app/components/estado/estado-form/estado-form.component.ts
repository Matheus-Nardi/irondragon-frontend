import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-estado-form',
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
  ],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private snackbarService: SnackbarService,
    private activateRoute: ActivatedRoute
  ) {
    const estado: Estado = this.activateRoute.snapshot.data['estado'];
    this.formGroup = this.formBuilder.group({
      id: [estado && estado.id ? estado.id : null],
      nome: [
        estado && estado.nome ? estado.nome : '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(60),
        ],
      ],
      sigla: [
        estado && estado.sigla ? estado.sigla : '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      const operacao =
        estado.id == null
          ? this.estadoService.create(estado)
          : this.estadoService.update(estado);

      operacao.subscribe({
        next: () => {
          console.log('Estado salvo com sucesso');
          this.router.navigateByUrl('/estados');
          this.snackbarService.showSuccess('Estado salvo com sucesso');
        },
        error: (err) => {
          console.log('Erro ao salvar o estado' + JSON.stringify(err));
          this.tratarErros(err);
          this.snackbarService.showError('Erro ao salvar estado');
        },
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      if (estado.id != null) {
        this.estadoService.delete(estado).subscribe({
          next: () => {
            console.log('Estado excluido com sucesso');
            this.router.navigateByUrl('/estados');
            this.snackbarService.showSuccess('Estado deletado com sucesso');
          },
          error: (err) => {
            console.log('Erro ao excluir o estado' + JSON.stringify(err));
            this.snackbarService.showError('Erro ao deletar estado');
          },
        });
      }
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
    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve ter no mínimo 4 caracteres.',
      maxlength: 'O nome deve ter no máximo 60 caracteres.',
      apiError: ' ',
    },
    sigla: {
      required: 'A sigla deve ser informada.',
      minlength: 'A sigla deve ter no mínimo 2 caracteres.',
      maxlength: 'A sigla deve ter no máximo 2 caracteres.',
      apiError: ' ',
    },
  };
}
