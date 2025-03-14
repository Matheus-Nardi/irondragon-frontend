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
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoService } from '../../../services/estado.service';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { Estado } from '../../../models/estado.model';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from '../../../services/dialog.service';

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
  ],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute
  ) {
    const estado: Estado = this.activatedRoute.snapshot.data['estado'];
    this.formGroup = this.fb.group({
      id: [estado && estado.id ? estado.id : null],
      nome: [estado && estado.nome ? estado.nome : '', Validators.required],
      sigla: [
        estado && estado.sigla ? estado.sigla : '',
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const novoEstado = this.formGroup.value;
      if (novoEstado.id == null) {
        this.createEstado(novoEstado);
      } else {
        this.updateEstado(novoEstado);
      }
    }
  }

  createEstado(novoEstado: Estado) {
    this.estadoService.create(novoEstado).subscribe({
      next: (estado) => {
        console.log('Estado cadastrado com sucesso');
        this.snackbarService.showSuccess('Estado cadastrado com sucesso');
        this.router.navigateByUrl('/estados');
      },
      error: (err) => {
        console.error('Erro ao cadastrar o estado' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao cadastrar o estado');
      },
    });
  }

  updateEstado(novoEstado: Estado) {
    this.estadoService.update(novoEstado).subscribe({
      next: (estado) => {
        console.log('Estado atualizado com sucesso');
        this.snackbarService.showSuccess('Estado atualizado com sucesso');
        this.router.navigateByUrl('/estados');
      },
      error: (err) => {
        console.error('Erro ao atualizar o estado' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao atualizar o estado');
      },
    });
  }

  onDeleteEstado(event: Event) {
    event.preventDefault();
    if (this.formGroup.valid) {
      const estado: Estado = this.formGroup.value;
      if (estado.id != null) {
        this.dialogService
          .openConfirmDialog(
            'Deletar Estado',
            'Você realmente deseja deletar este estado?',
            'warning'
          )
          .subscribe((result) => {
            if (result) {
              this.deleteEstado(estado);  
            }
          });
      }
    }
  }

  deleteEstado(estado: Estado): void {
    this.estadoService.delete(estado).subscribe({
      next: () => {
        console.log('Estado deletado com sucesso');
        this.snackbarService.showSuccess('Estado deletado com sucesso');
        this.router.navigateByUrl('/estados');
      },
      error: (err) => {
        console.error('Erro ao deletar o estado', err);
      },
    });
  }
}
