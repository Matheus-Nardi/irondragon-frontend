import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Endereco } from '../../models/endereco/endereco.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Cidade } from '../../models/cidade.model';
import { Estado } from '../../models/estado.model';
import { CidadeService } from '../../services/cidade.service';
import { EstadoService } from '../../services/estado.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-endereco-form-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './endereco-form-modal.component.html',
  styleUrl: './endereco-form-modal.component.css'
})
export class EnderecoFormModalComponent implements OnInit {

  formEndereco!: FormGroup;
  estados: Estado[] = [];
  cidades: Cidade[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnderecoFormModalComponent>,
   @Inject(MAT_DIALOG_DATA) public endereco: Partial<Endereco> = {},
    private estadoService: EstadoService,
    private cidadeService: CidadeService
  ) {
    console.log(endereco);
    
  }

  ngOnInit(): void {
    this.estadoService.findAll(0, 100).subscribe((estados) => {
      this.estados = estados.results;
      this.initializeForm();
    });
  }

  initializeForm(): void {
  const cidade = this.endereco?.cidade;
  const estado = this.estados.find((e) => e.id === cidade?.estado?.id) || null;

  this.formEndereco = this.fb.group({
    logradouro: [this.endereco?.logradouro || '', Validators.required],
    numero: [this.endereco?.numero || '', Validators.required],
    complemento: [this.endereco?.complemento || ''],
    bairro: [this.endereco?.bairro || '', Validators.required],
    cep: [this.endereco?.cep || '', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
    estado: [estado, Validators.required],
    cidade: [null, Validators.required],
  });

  if (estado) {
    this.carregarCidades(estado.id, cidade); 
  }

  this.formEndereco.get('estado')?.valueChanges.subscribe((estadoSelecionado: Estado) => {
    this.carregarCidades(estadoSelecionado.id);
    this.formEndereco.get('cidade')?.reset();
  });
}

 private carregarCidades(idEstado: number, cidadeSelecionada?: Cidade): void {
  this.cidadeService.findByEstado(idEstado).subscribe((cidades) => {
    this.cidades = cidades;

    if (cidadeSelecionada) {
      const cidade = this.cidades.find((c) => c.id === cidadeSelecionada.id);
      this.formEndereco.get('cidade')?.setValue(cidade);
    }
  });
}

  salvar(): void {
    if (this.formEndereco.valid) {
      const enderecoAtualizado = {
        ...this.endereco,
        ...this.formEndereco.value,
        cidade: this.formEndereco.value.cidade,
      };
      this.dialogRef.close(enderecoAtualizado);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
