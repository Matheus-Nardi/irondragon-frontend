import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CidadeService } from '../../../services/cidade.service';
import { Router } from '@angular/router';
import { Cidade } from '../../../models/cidade.model';
import { MatSelectModule } from '@angular/material/select';
import { EstadoService } from '../../../services/estado.service';
import { Estado } from '../../../models/estado.model';

@Component({
  selector: 'app-cidade-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NgIf, MatToolbarModule, MatButtonModule, CommonModule, MatSelectModule],
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css'
})
export class CidadeFormComponent implements OnInit {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(private formBuilder: FormBuilder, private cidadeService: CidadeService, private router: Router, private estadoService: EstadoService) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      estado: [null, Validators.required]
    })
  }

  ngOnInit() {
    this.estadoService.findAll().subscribe((data) => {
      this.estados = data;
    });
  }

  onSubmit() {
    if(this.formGroup.valid) {
      const cidadeForm = this.formGroup.value;

      this.cidadeService.create(cidadeForm).subscribe({
        next: (cidade) => {
          console.log('Cidade cadastrada com sucesso');
          this.router.navigateByUrl('/cidades');
        },
        error: (err) => {
          console.log(`Erro ao cadastrar a cidade ${JSON.stringify(err)}`)
        }
      })
    }
  }
}
