import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Fornecedor, IFornecedor } from '../../../models/fornecedor.model';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fornecedor-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatToolbarModule, MatButtonModule, CommonModule, MatCardModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})
export class FornecedorFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private fornecedorService: FornecedorService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    const fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : '', Validators.required],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : '', [Validators.required, Validators.email]],
      codigoArea: [(fornecedor && fornecedor.telefone.codigoArea) ? fornecedor.telefone.codigoArea : '', [Validators.required, Validators.minLength(2)]],
      numero: [(fornecedor && fornecedor.telefone.numero) ? fornecedor.telefone.numero : '', Validators.required]
    });
  }

  onSubmit() {
    if(this.formGroup.valid) {
      const fornecedorForm = this.formGroup.value;

      const data: IFornecedor = {
        id: fornecedorForm.id,
        nome: fornecedorForm.nome,
        email: fornecedorForm.email,
        telefone: {
          codigoArea: fornecedorForm.codigoArea,
          numero: fornecedorForm.numero
        }
      }

      const fornecedor = Fornecedor.valueOf(data);

      if(fornecedorForm.id == null) {
        this.fornecedorService.create(fornecedor).subscribe({
          next: (fornecedor) => {
            console.log('Fornecedor cadastrado com sucesso!');
            this.router.navigateByUrl('/fornecedores');
          },
          error: (err) => {
            console.log(`Erro ao cadastrar o fornecedor ${JSON.stringify(err)}`);
          }
        });
      } else {
        this.fornecedorService.update(fornecedor).subscribe({
          next: () => {
            this.router.navigateByUrl('/fornecedores');
          },
          error: (err) => {
            console.error(`Erro ao atualizar o fornecedor, ${err}`);
          }
        });
      }
    }
  }

  onDelete() {
    const fornecedorForm = this.formGroup.value;
    if(fornecedorForm.id != null) {
      this.fornecedorService.delete(fornecedorForm).subscribe({
        next: () => {
          this.router.navigateByUrl('/fornecedor');
        },
        error: (err) => {
          console.error('Erro ao excluir ' + JSON.stringify(err));
        }
      })
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
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

  errorHandling(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          // console.log(validationError);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      };
    } else if (httpError.status < 500) {
      alert(httpError.error?.message || 'Erro genérico no envio do formulário');    
    } else {
      alert(httpError.error?.message || 'Erro não mapeado do servidor');    
    }
  }

  errorMessages: {[controlName: string] : {[errorName: string] : string}} = {
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' '
    },
    email: {
      required: 'O email deve ser informado',
      email: 'Informe um email válido',
      apiError: ' '
    },
    telefone: {
      required: 'O telefone deve ser informado',
      pattern: 'Informe um número valido',
      apiError: ' '
    },
    codigoArea: {
      required: 'O código área deve bosta informado',
      minlength: 'Deve conter no minimo 2 caracteres',
      apiError: ' '
    },
    numero: {
      required: 'O numero deve bosta informado',
      apiError: ' '
    }
  }
}
