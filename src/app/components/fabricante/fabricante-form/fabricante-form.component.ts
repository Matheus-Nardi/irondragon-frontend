import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FabricanteService } from '../../../services/fabricante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fabricante-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './fabricante-form.component.html',
  styleUrl: './fabricante-form.component.css'
})
export class FabricanteFormComponent {

  formGroup: FormGroup;
  
    constructor(
      private formBuilder: FormBuilder,
      private fabricanteService: FabricanteService,
      private router: Router
    ) {
      this.formGroup = this.formBuilder.group({
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        codigoArea: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        numero: ['', [Validators.required]],
      });
    }

    onSubmit() {
      if (this.formGroup.valid) {
        const novofabricante = this.formGroup.value;
        this.fabricanteService.create(novofabricante).subscribe({
          next: (fabricante) => {
            console.log('Fabricante cadastrado com sucesso');
            this.router.navigateByUrl('/fabricantes');
          },
          error: (err) => {
            console.error('Erro ao cadastrar o fabricante' + JSON.stringify(err));
          },
        });
      }
    }
}
