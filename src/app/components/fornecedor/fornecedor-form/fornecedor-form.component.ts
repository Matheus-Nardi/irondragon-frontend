import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Fornecedor, IFornecedor } from '../../../models/fornecedor.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-fornecedor-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatToolbarModule, MatButtonModule, CommonModule, MatCardModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})
export class FornecedorFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private fornecedorService: FornecedorService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    const fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : '', Validators.required],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : '', Validators.email],
      codigoArea: [(fornecedor && fornecedor.telefone.codigoArea) ? fornecedor.telefone.codigoArea : '', Validators.required],
      numero: [(fornecedor && fornecedor.telefone.numero) ? fornecedor.telefone.numero : '', Validators.required]
    });
  }

  onSubmit() {
    if(this.formGroup.valid) {
      const fornecedorForm = this.formGroup.value;

      const data: IFornecedor = {
        id: fornecedorForm.id,
        nome: fornecedorForm.nome,
        email: fornecedorForm.email,
        telefone: {
          codigoArea: fornecedorForm.codigoArea,
          numero: fornecedorForm.numero
        }
      }

      const fornecedor = Fornecedor.valueOf(data);

      if(fornecedorForm.id == null) {
        this.fornecedorService.create(fornecedor).subscribe({
          next: (fornecedor) => {
            console.log('Fornecedor cadastrado com sucesso!');
            this.router.navigateByUrl('/fornecedores');
          },
          error: (err) => {
            console.log(`Erro ao cadastrar o fornecedor ${JSON.stringify(err)}`);
          }
        });
      } else {
        this.fornecedorService.update(fornecedor).subscribe({
          next: () => {
            this.router.navigateByUrl('/fornecedores');
          },
          error: (err) => {
            console.error(`Erro ao atualizar o fornecedor, ${err}`);
          }
        });
      }
    }
  }

  onDelete() {
    const fornecedorForm = this.formGroup.value;
    if(fornecedorForm.id != null) {
      this.fornecedorService.delete(fornecedorForm).subscribe({
        next: () => {
          this.router.navigateByUrl('/fornecedor');
        },
        error: (err) => {
          console.error('Erro ao excluir ' + JSON.stringify(err));
        }
      })
    }
  }
}
