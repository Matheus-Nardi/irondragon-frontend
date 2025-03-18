import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
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
import { FabricanteService } from '../../../services/fabricante.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timeout } from 'rxjs';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { Fabricante } from '../../../models/fabricante.model';
import { MatCardModule } from '@angular/material/card';

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
        Validators.required,
      ],
      email: [
        fabricante && fabricante.email ? fabricante.email : '',
        [Validators.required, Validators.email],
      ],
      codigoArea: [
        fabricante && fabricante.telefone.codigoArea
          ? fabricante.telefone.codigoArea
          : '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      numero: [
        fabricante && fabricante.telefone.numero
          ? fabricante.telefone.numero
          : '',
        [Validators.required, Validators.pattern(/^\d{8,9}$/)],
      ],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const telefone = {
        codigoArea: formValue.codigoArea,
        numero: formValue.numero,
      };

      const novoFabricante = {
        id: formValue.id,
        nome: formValue.nome,
        email: formValue.email,
        telefone: telefone,
      };
      if (formValue.id == null) {
        this.createFabricante(novoFabricante);
      } else {
        this.editFabricante(novoFabricante);
      }
    }
  }

  excluir(){
    if (this.formGroup.valid) {
      const fabricante = this.formGroup.value;
      if (fabricante.id != null) {
        this.fabricanteService.delete(fabricante).subscribe({
          next: () => {
            console.log('Fabricante excluido com sucesso');
            this.router.navigateByUrl('/fabricantes');
            this.snackbarService.showSuccess('fabricante deletado com sucesso');
          },
          error: (err) => {
            console.log('Erro ao excluir o fabricante' + JSON.stringify(err));
            this.snackbarService.showError('Erro ao deletar fabricante');
          },
        });
      }
    }
  }

  private createFabricante(novoFabricante: Fabricante) {
    this.fabricanteService.create(novoFabricante).subscribe({
      next: (fabricante) => {
        console.log('Fabricante cadastrado com sucesso');
        this.snackbarService.showSuccess('Fabricante cadastrado com sucesso');
        this.router.navigateByUrl('/fabricantes');
      },
      error: (err) => {
        console.error('Erro ao cadastrar o fabricante' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao cadastrar o fabricante');
      },
    });
  }

  private editFabricante(novoFabricante: Fabricante) {
    this.fabricanteService.update(novoFabricante).subscribe({
      next: () => {
        console.log('Fabricante atualizado com sucesso');
        this.router.navigateByUrl('/fabricantes');
        this.snackbarService.showSuccess('fabricante atualizado com sucesso');
      },
      error: (err) => {
        console.log('Erro ao atualizar o fabricante' + JSON.stringify(err));
        this.snackbarService.showError('Erro ao atualizar fabricante');
      },
    });
  }
}
