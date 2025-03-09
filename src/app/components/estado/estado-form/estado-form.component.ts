import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-estado-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatToolbarModule, MatButtonModule],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private estadoService: EstadoService,
    private router: Router
  ) {
    this.formGroup = this.fb.group({
      nome: ['', Validators.required],
      sigla: [
        '',
        [
        Validators.required,
        Validators.maxLength(2),
        Validators.minLength(2)]
      ],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const novoEstado = this.formGroup.value;
      this.estadoService.create(novoEstado).subscribe({
        next: (estado) => {
          console.log('Estado cadastrado com sucesso');
          this.router.navigateByUrl('/estados');
        },
        error: (err) => {
          console.error('Erro ao cadastrar o estado' + JSON.stringify(err));
        },
      });
    }
  }
}
