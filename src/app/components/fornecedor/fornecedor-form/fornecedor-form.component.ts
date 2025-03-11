import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Fornecedor } from '../../../models/fornecedor.model';

@Component({
  selector: 'app-fornecedor-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatToolbarModule, MatButtonModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})
export class FornecedorFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private fornecedorService: FornecedorService, private router: Router) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.email],
      codigoArea: ['', Validators.required],
      numero: ['', Validators.required]
    });
  }

  onSubmit() {
    if(this.formGroup.valid) {
      const fornecedorForm = this.formGroup.value;

      const novoFornecedor: Fornecedor = Fornecedor.valueOf({
        nome: fornecedorForm.nome,
        email: fornecedorForm.email,
        telefone: {
          codigoArea: fornecedorForm.codigoArea,
          numero: fornecedorForm.numero
        }
      });

      this.fornecedorService.create(novoFornecedor).subscribe({
        next: (fornecedor) => {
          console.log('Fornecedor cadastrado com sucesso!');
          this.router.navigateByUrl('/fornecedores');
        },
        error: (err) => {
          console.log(`Erro ao cadastrar o fornecedor ${JSON.stringify(err)}`);
        }
      });
    }
  }
}
