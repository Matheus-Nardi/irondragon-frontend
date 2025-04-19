import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatCardModule } from '@angular/material/card';
import { FuncionarioService } from '../../../services/funcionario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpErrorResponse } from '@angular/common/http';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Funcionario } from '../../../models/funcionario.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-funcionario-form',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR',
    },
  ],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatDividerModule
    
  ],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css',
})
export class FuncionarioFormComponent implements AfterViewInit {
  usuario!: Usuario;
  editando = false;
  usuarioEncontrado = false;

  @ViewChild('stepper') stepper!: MatStepper;

  formGroupFindByCpf!: FormGroup;
  formGroupFuncionario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private funcionarioService: FuncionarioService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroupFindByCpf = this.formBuilder.group({
      cpf: ['', Validators.required],
    });

    const funcionario: Funcionario =
      this.activatedRoute.snapshot.data['funcionario'];

    this.editando = !!funcionario?.id;

    this.formGroupFuncionario = this.formBuilder.group({
      id: funcionario?.id || null,
      cargo: [funcionario?.cargo || '', Validators.required],
      salario: [funcionario?.salario || '', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      dataContratacao: [funcionario?.dataContratacao || '', Validators.required],
    });

    // Se estiver editando, preenche o usuário também
    if (this.editando && funcionario?.usuario) {
      this.usuario = funcionario.usuario;
      this.usuarioEncontrado = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.editando) {
      setTimeout(() => {
        this.stepper.selectedIndex = 1;
      }, 0);
    }
  }

  findByCpf(cpf: string) {
    this.usuarioService.findByCpf(cpf).subscribe({
      next: (data) => {
        this.usuario = data;
        this.usuarioEncontrado = true;
        this.snackbarService.showSuccess('Usuário encontrado!');
        this.stepper.next();
        console.log(this.usuario);
      },
      error: (err) => {
        this.usuarioEncontrado = false;
        console.error('Usuário não encontrado!', err);
        this.snackbarService.showError(
          'Nenhum usuário encontrado com esse CPF!'
        );
      },
    });
  }

  salvar() {
    this.formGroupFuncionario.markAllAsTouched();
    if (this.formGroupFuncionario.valid) {

      const funcionario = this.formGroupFuncionario.value;
      const operacao =
        funcionario.id == null
          ? this.funcionarioService.create(this.usuario.id,funcionario)
          : this.funcionarioService.update(funcionario);

      operacao.subscribe({
        next: () => {
          console.log('Funcionario salvo com sucesso');
          this.router.navigateByUrl('/admin/funcionarios');
          this.snackbarService.showSuccess('Funcionario salvo com sucesso');
        },
        error: (err) => {
          console.log('Erro ao salvar o funcionario' + JSON.stringify(err));
          this.tratarErros(err);
          this.snackbarService.showError('Erro ao salvar funcionario');
        },
      });
    }
  }
  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroupFuncionario.get(
            validationError.fieldName
          );
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
    cargo: {
      required: 'O cargo deve ser informado.',
      minlength: 'O nome deve ter no mínimo 2 caracteres.',
      maxlength: 'O nome deve ter no máximo 70 caracteres.',
      apiError: ' ',
    },
    salario: {
      required: 'O salário deve ser informado.',
      pattern: 'Informe um valor decimal válido, ex: 199.99',
      apiError: ' ',
    },
    dataContratacao: {
      required: 'A data de contratação deve ser informada.',
      apiError: ' ',
    },
  };
}
