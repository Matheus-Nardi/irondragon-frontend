import { CommonModule, NgIf } from '@angular/common';
import { Component , inject, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FabricanteService } from '../../../services/fabricante.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timeout } from 'rxjs';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { SnackbarService } from '../../../services/snackbar.service';

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
      private router: Router,
      private snackbarService: SnackbarService
    ) {
      this.formGroup = this.formBuilder.group({
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        codigoArea: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        numero: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]],
      });
    }

    onSubmit() {
      if (this.formGroup.valid) {
       
        const formValue = this.formGroup.value;

        const telefone = {
          codigoArea: formValue.codigoArea,
          numero: formValue.numero,
        };
  
        const novoFabricante = {
          nome: formValue.nome,
          email: formValue.email,
          telefone: telefone, 
        };

        this.fabricanteService.create(novoFabricante).subscribe({
          next: (fabricante) => {
            console.log('Fabricante cadastrado com sucesso');
            this.snackbarService.showSuccess("Fabricante cadastrado com sucesso");
            this.router.navigateByUrl('/fabricantes');
          },
          error: (err) => {
            console.error('Erro ao cadastrar o fabricante' + JSON.stringify(err));
            this.snackbarService.showError("Erro ao cadastrar o fabricante");
          },
        });
      }
    }

    

   
}
