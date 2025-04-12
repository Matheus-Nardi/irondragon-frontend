import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CidadeService } from '../../../services/cidade.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cidade } from '../../../models/cidade.model';
import { MatSelectModule } from '@angular/material/select';
import { EstadoService } from '../../../services/estado.service';
import { Estado } from '../../../models/estado.model';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cidade-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css',
})
export class CidadeFormComponent implements OnInit {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private router: Router,
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      estado: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.estadoService.findAll().subscribe((data) => {
      this.estados = data.results;
      this.initializeForm();
    });
  }

  initializeForm(): void {
    const cidade = this.activatedRoute.snapshot.data['cidade'];

    const estado = this.estados.find(
      (e) => e.id === cidade?.estado?.id || null
    );

    this.formGroup = this.formBuilder.group({
      id: [cidade && cidade.id ? cidade.id : null],
      nome: [cidade && cidade.id ? cidade.nome : '', Validators.required],
      estado: [estado && estado.id ? estado : null, Validators.required],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const cidadeForm = this.formGroup.value;

      if (cidadeForm.id == null) {
        this.cidadeService.create(cidadeForm).subscribe({
          next: (cidade) => {
            console.log('Cidade cadastrada com sucesso');
            this.router.navigateByUrl('/admin/cidades');
          },
          error: (err) => {
            console.log(`Erro ao cadastrar a cidade ${JSON.stringify(err)}`);
          },
        });
      } else {
        this.cidadeService.update(cidadeForm).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/cidades');
          },
          error: (err) => {
            console.log(`Erro ao atualizar a cidade ${JSON.stringify(err)}`);
          },
        });
      }
    }
  }

  onDelete() {
    const cidadeForm = this.formGroup.value;
    if (cidadeForm.id != null) {
      this.cidadeService.delete(cidadeForm).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/cidades');
        },
        error: (err) => {
          console.error('Erro ao excluir ' + JSON.stringify(err));
        },
      });
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
      }
    } else if (httpError.status < 500) {
      alert(httpError.error?.message || 'Erro genérico no envio do formulário');
    } else {
      alert(httpError.error?.message || 'Erro não mapeado do servidor');
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      apiError: ' ',
    },
    estado: {
      required: 'O estado deve ser referenciado',
      apiError: ' ',
    },
  };

  onCancel() {
    this.router.navigateByUrl('/admin/cidades');
  }
}
