import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProcessadorService } from '../../../services/processador.service';
import { FabricanteService } from '../../../services/fabricante.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Fabricante } from '../../../models/fabricante.model';
import { PlacaIntegrada } from '../../../models/processador/placaintegrada.model';
import { PlacaintegradaService } from '../../../services/placaintegrada.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { Processador } from '../../../models/processador/processador.model';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-processador-form',
  templateUrl: './processador-form.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule
  ],
  styleUrls: ['./processador-form.component.css']
})
export class ProcessadorFormComponent implements OnInit {
  formGroup!: FormGroup;
  fabricantes: Fabricante[] = [];
  placasIntegradas: PlacaIntegrada[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private processadorService: ProcessadorService,
    private fabricanteService: FabricanteService,
    private placaIntegradaService: PlacaintegradaService,
    private router: Router,
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      socket: ['', Validators.required],
      threads: ['', Validators.required],
      nucleos: ['', Validators.required],
      desbloqueado: ['', Validators.required],
      preco: ['', Validators.required],
      fabricante: [null, Validators.required],
      placaIntegrada: [null],
      memoriaCache: this.formBuilder.group({
        cacheL2: ['', Validators.required],
        cacheL3: ['', Validators.required]
      }),
      frequencia: this.formBuilder.group({
        clockBasico: ['', Validators.required],
        clockBoost: ['', Validators.required],
      }),
      consumoEnergetico: this.formBuilder.group({
        energiaBasica: ['', Validators.required],
        energiaMaxima: [''],
      }),
      conectividade: this.formBuilder.group({
        pci: ['', Validators.required],
        tipoMemoria: ['', Validators.required],
        canaisMemoria: ['', Validators.required],
      })
    })
  }

  ngOnInit(): void {
    forkJoin({
      fabricantes: this.fabricanteService.findAll(),
      placasIntegradas: this.placaIntegradaService.findAll()
    }).subscribe(({ fabricantes, placasIntegradas }) => {
      this.fabricantes = fabricantes.results;
      this.placasIntegradas = placasIntegradas.results;
  
      this.initializeForm();
    });
  }

  initializeForm(): void {
    const processador = this.activatedRoute.snapshot.data['processador'];

    const fabricante = this.fabricantes.find(f => f.id === (processador?.fabricante?.id ?? null));
    const placaIntegrada = this.placasIntegradas.find(p => p.id === (processador?.placaIntegrada?.id ?? null));


    this.formGroup = this.formBuilder.group({
      id: [processador && processador.id ? processador.id : null],
      nome: [processador && processador.nome ? processador.nome : ''],
      socket: [processador && processador.socket ? processador.socket : ''],
      threads: [processador && processador.threads ? processador.threads : ''],
      nucleos: [processador && processador.nucleos ? processador.nucleos : ''],
      desbloqueado: [processador && processador.desbloqueado ? processador.desbloqueado : ''],
      preco: [processador && processador.preco ? processador.preco : ''],
      fabricante: [fabricante && fabricante?.id ? fabricante : null],
      placaIntegrada: [placaIntegrada && placaIntegrada.id ? processador.placaIntegrada : null],
      memoriaCache: this.formBuilder.group({
        cacheL2: [processador.memoriaCache && processador.memoriaCache.cacheL2 ? processador.memoriaCache.cacheL2 : ''],
        cacheL3: [processador.memoriaCache && processador.memoriaCache.cacheL3 ? processador.memoriaCache.cacheL3 : '']
      }),
      frequencia: this.formBuilder.group({
        clockBasico: [processador.frequencia && processador.frequencia.clockBasico ? processador.frequencia.clockBasico : ''],
        clockBoost: [processador.frequencia && processador.frequencia.clockBoost ? processador.frequencia.clockBoost : ''],
      }),
      consumoEnergetico: this.formBuilder.group({
        energiaBasica: [processador.consumoEnergetico && processador.consumoEnergetico.energiaBasica ? processador.consumoEnergetico.energiaBasica : ''],
        energiaMaxima: [processador.consumoEnergetico && processador.consumoEnergetico.energiaMaxima ? processador.consumoEnergetico.energiaMaxima : ''],
      }),
      conectividade: this.formBuilder.group({
        pci: [processador && processador.conectividade.pci ? processador.conectividade.pci : ''],
        tipoMemoria: [processador && processador.conectividade.tipoMemoria ? processador.conectividade.tipoMemoria : ''],
        canaisMemoria: [processador && processador.conectividade.canaisMemoria ? processador.conectividade.canaisMemoria : ''],
      })
    })
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const processadorForm = this.formGroup.value;
      console.log(JSON.stringify(processadorForm));

      if (processadorForm.id == null) {
        this.onCreate(processadorForm);
      } else {
        this.onEdit(processadorForm);
      }
    } else {
      this.formGroup.markAllAsTouched;
    }
  }

  onCreate(processador: Processador): void {
    this.processadorService.create(processador).subscribe({
      next: (processador) => {
        this.snackbarService.showSuccess('Processador criado com sucesso!');
        console.log('Processador criado com sucesso!');
        this.router.navigateByUrl('/admin/processadores');
      }
    });
  }

  onEdit(processador: Processador): void {
    this.processadorService.update(processador).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Processador alterado com sucesso!');
        console.log('Processador alterado com sucesso!');
        this.router.navigateByUrl('/admin/processadores');
      }
    });
  }

  onDelete(): void {
  }


  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for (const errorName in errors) {
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  errorHandling(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          // console.log(validationError);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      };
    } else if (httpError.status < 500) {
      alert(httpError.error?.message || 'Erro genérico no envio do formulário');
    } else {
      alert(httpError.error?.message || 'Erro não mapeado do servidor');
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' '
    }
  }
}
