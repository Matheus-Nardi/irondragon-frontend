import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PlacaintegradaService} from '../../../services/placaintegrada.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {NgIf, TitleCasePipe} from '@angular/common';
import {IPlacaIntegrada, PlacaIntegrada} from '../../../models/processador/placaintegrada.model';
import {SnackbarService} from '../../../services/snackbar.service';
import {Fornecedor} from '../../../models/fornecedor.model';

@Component({
  selector: 'app-placaintegrada-form',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormField,
    MatIconModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './placaintegrada-form.component.html',
  styleUrl: './placaintegrada-form.component.css'
})
export class PlacaintegradaFormComponent {
  formGroup: FormGroup;

  constructor(
    private placaIntegradaService: PlacaintegradaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    const placaIntegrada = this.activatedRoute.snapshot.data['placaintegrada'];

    this.formGroup = this.formBuilder.group({
      id: [(placaIntegrada && placaIntegrada.id) ? placaIntegrada.id : null],
      nome: [(placaIntegrada && placaIntegrada.nome) ? placaIntegrada.nome : '', [Validators.required]],
      directX: [(placaIntegrada && placaIntegrada.directX) ? placaIntegrada.directX : '', [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]],
      openGl: [(placaIntegrada && placaIntegrada.openGl) ? placaIntegrada.openGl : '', [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]],
      vulkan: [(placaIntegrada && placaIntegrada.vulkan) ? placaIntegrada.vulkan : '', [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]]
    });
  }

  onSubmit() {
    if(this.formGroup.valid) {
      const placaIntegradaForm = this.formGroup.value;

      const data: PlacaIntegrada = new PlacaIntegrada({
        id: placaIntegradaForm.id,
        nome: placaIntegradaForm.nome,
        directX: placaIntegradaForm.directX,
        openGl: placaIntegradaForm.openGl,
        vulkan: placaIntegradaForm.vulkan
      });

      if(placaIntegradaForm.id == null) {
        this.onCreate(data);
      } else {
        this.onEdit(data);
      }
    }
  }

  onCreate(placaIntegrada: PlacaIntegrada) {
    this.placaIntegradaService.create(placaIntegrada).subscribe({
      next: (placaIntegrada) => {
        this.snackbarService.showSuccess('Placa Integrada criada com sucesso!');
        console.log('Placa Integrada criada com sucesso', JSON.stringify(placaIntegrada));
        this.router.navigateByUrl('/placasintegradas');
      },
      error: (err) => {
        console.error('Erro ao cadastrar a placa', err);
      }
    });
  }

  onEdit(placaIntegrada: PlacaIntegrada) {
    this.placaIntegradaService.update(placaIntegrada).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Placa Integrada alterada com sucesso!');
        console.log('Placa Integrada alterada com sucesso');
        this.router.navigateByUrl('/placasintegradas');
      },
      error: (err) => {
        console.error('Erro ao alterar o cadastro da placa', err);
      }
    })
  }

  onDelete() {
    if(this.formGroup.valid) {
      const placaIntegradaForm = this.formGroup.value;

      this.placaIntegradaService.delete(placaIntegradaForm).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Placa Integrada deletada com sucesso!');
          console.log('Placa Integrada deletada com sucesso!');
          this.router.navigateByUrl('/placasintegradas');
        },
        error: (err) => {
          console.error('Erro ao deletar a placa', err);
        }
      });
    }
  }
}
