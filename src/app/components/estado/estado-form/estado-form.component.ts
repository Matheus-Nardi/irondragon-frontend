import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoService } from '../../../services/estado.service';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { Estado } from '../../../models/estado.model';
import { MatCardModule } from '@angular/material/card';

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
    RouterLink
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
      nome: [estado && estado.nome ? estado.nome : '', Validators.required],
      sigla: [
        estado && estado.sigla ? estado.sigla : '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const novoEstado = this.formGroup.value;
      if (novoEstado.id == null) {
        this.createEstado(novoEstado);
      } else {
        this.editEstado(novoEstado);
      }
    }
  }

  private createEstado(novoEstado: Estado) {
    this.estadoService.create(novoEstado).subscribe({
      next: (estado) => {
        console.log('Estado cadastrado com sucesso');
        this.router.navigateByUrl('/estados');
        this.snackbarService.showSuccess('Estado cadastrado com sucesso');
      },
      error: (err) => {
        console.log('Erro ao cadastrar o estado' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao cadastrar estado');
      },
    });
  }

  private editEstado(novoEstado: Estado) {
    this.estadoService.update(novoEstado).subscribe({
      next: () => {
        console.log('Estado atualizado com sucesso');
        this.router.navigateByUrl('/estados');
        this.snackbarService.showSuccess('Estado atualizado com sucesso');
      },
      error: (err) => {
        console.log('Erro ao atualizar o estado' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao autalizar estado');
      },
    });
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
}
