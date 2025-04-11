import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProcessadorService } from '../../../services/processador.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-processador-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './processador-form.component.html',
  styleUrl: './processador-form.component.css'
})
export class ProcessadorFormComponent {
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private processadorService: ProcessadorService,
    private router: Router,
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute
  ) {
    const processador = this.activatedRoute.snapshot.data['processador'];

    this.formGroup = this.formBuilder.group({
      id: [processador && processador.id ? processador.id : null],
      nome: [processador && processador.nome ? processador.nome : null],
      socket: [processador && processador.socket ? processador.socket : null],
      threads: [processador && processador.threads ? processador.threads : null],
      desbloqueado: [processador && processador.desbloqueado ? processador.desbloqueado : null],
      preco: [processador && processador.preco ? processador.preco : null],
      fabricante: [processador.fabricante && processador.fabricante.id ? processador.fabricante.id : null],
      placaIntegrada: [processador.placaIntegrada && processador.placaIntegrada.id ? processador.placaIntegrada.id : null],
      memoriaCache: this.formBuilder.group({
        cacheL2: [processador.memoriaCache && processador.memoriaCache.cacheL2 ? processador.memoriaCache.cacheL2 : null],
        cacheL3: [processador.memoriaCache && processador.memoriaCache.cacheL3 ? processador.memoriaCache.cacheL3  : null]
      }),
      frequencia: this.formBuilder.group({
        clockBasico: [processador.frequencia && processador.frequencia.clockBasico ? processador.memoriaCache.clockBasico : null],
        clockBoost: [processador.frequencia && processador.frequencia.clockBoost ? processador.memoriaCache.clockBoost : null],
      }),
      consumoEnergetico: this.formBuilder.group({
        energiaBasica: [processador.consumoEnergetico && processador.consumoEnergetico.energiaBasica ? processador.consumoEnergetico.energiaBasica : null],
        energiaMaxima: [processador.consumoEnergetico && processador.consumoEnergetico.energiaMaxima ? processador.consumoEnergetico.energiaMaxima : null],
      }),
      conectividade: this.formBuilder.group({
        pci: [processador && processador.conectividade.pci ? processador.conectividade.pci : null],
        tipoMemoria: [processador && processador.conectividade.tipoMemoria? processador.conectividade.tipoMemoria : null],
        canaisMemoria: [processador && processador.conectividade.canaisMemoria? processador.conectividade.canaisMemoria : null],
      })
    })
  }


  onSubmit(): void {
    this.formGroup.markAllAsTouched();

    if(this.formGroup.valid) {
      const processadorForm = this.formGroup.value;

      const operation = 
      processadorForm.id == null 
      ? this.processadorService.create(processadorForm)
      : this.processadorService.update(processadorForm);

      operation.subscribe({
        next: () => {
          console.log('Processador salvo com sucesso!');
          this.router.navigateByUrl('/admin/processadores');
          this.snackbarService.showSuccess('Processador salvo com sucesso!');
        }
      })
    }
  }

  onDelete(): void {
    
  }
}
