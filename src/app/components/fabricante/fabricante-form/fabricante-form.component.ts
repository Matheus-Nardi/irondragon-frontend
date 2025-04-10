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
import { Fabricante } from '../../../models/fabricante.model';
import { FabricanteService } from '../../../services/fabricante.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-fabricante-form',
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
    RouterLink
  ],
  templateUrl: './fabricante-form.component.html',
  styleUrl: './fabricante-form.component.css',
})
export class FabricanteFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fabricanteService: FabricanteService,
    private router: Router,
    private snackbarService: SnackbarService,
    private actavateRoute: ActivatedRoute
  ) {
    const fabricante: Fabricante =
      this.actavateRoute.snapshot.data['fabricante'];
    this.formGroup = this.formBuilder.group({
      id: [fabricante && fabricante.id ? fabricante.id : null],
      nome: [
        fabricante && fabricante.nome ? fabricante.nome : '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
      ],
      email: [
        fabricante && fabricante.email ? fabricante.email : '',
        [Validators.required, Validators.email],
      ],
      telefone: this.formBuilder.group({
        codigoArea: [fabricante?.telefone?.codigoArea || '', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        numero: [fabricante?.telefone?.numero || '', [Validators.required, Validators.pattern(/^\d{8,9}$/)]],
      })
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {

      const fabricante = this.formGroup.value;
      const operacao =
        fabricante.id == null
          ? this.fabricanteService.create(fabricante)
          : this.fabricanteService.update(fabricante);

      operacao.subscribe({
        next: () => {
          console.log('Fabricante salvo com sucesso');
          this.router.navigateByUrl('/fabricantes');
          this.snackbarService.showSuccess('Fabricante salvo com sucesso');
        },
        error: (err) => {
          console.log('Erro ao salvar o fabricante' + JSON.stringify(err));
          this.tratarErros(err);
          this.snackbarService.showError('Erro ao salvar fabricante');
        },
      });
    }
  }


  excluir() {
    if (this.formGroup.valid) {
      const fabricante = this.formGroup.value;
      if (fabricante.id != null) {
        this.fabricanteService.delete(fabricante).subscribe({
          next: () => {
            console.log('Fabricante excluido com sucesso');
            this.router.navigateByUrl('/fabricantes');
            this.snackbarService.showSuccess('Fabricante deletado com sucesso');
          },
          error: (err) => {
            console.log('Erro ao excluir o fabricante' + JSON.stringify(err));
            this.snackbarService.showError('Erro ao deletar fabricante');
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
        minlength: 'O nome deve ter no mínimo 2 caracteres.',
        maxlength: 'O nome deve ter no máximo 60 caracteres.',
        apiError: ' ',
      },
      email: {
        required: 'O e-mail deve ser informado.',
        email: 'Informe um e-mail válido.',
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
      }
    };
    
}
