import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  styleUrls: ['./processador-form.component.css'],
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
      threads: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      nucleos: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      desbloqueado: [false, Validators.required],
      preco: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')],
      ],
      fabricante: [null, Validators.required],
      placaIntegrada: [null],
      memoriaCache: this.formBuilder.group({
        cacheL2: [
          '',
          [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
        ],
        cacheL3: [
          '',
          [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
        ],
      }),
      frequencia: this.formBuilder.group({
        clockBasico: [
          '',
          [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
        ],
        clockBoost: [
          '',
          [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
        ],
      }),
      consumoEnergetico: this.formBuilder.group({
        energiaBasica: [
          '',
          [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
        ],
        energiaMaxima: ['', [Validators.pattern('^[1-9][0-9]*$')]],
      }),
      conectividade: this.formBuilder.group({
        pci: [
          '',
          [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
        ],
        tipoMemoria: ['', Validators.required],
        canaisMemoria: [
          '',
          [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
        ],
      }),
    });
  }

  ngOnInit(): void {
    forkJoin({
      fabricantes: this.fabricanteService.findAll(),
      placasIntegradas: this.placaIntegradaService.findAll(),
    }).subscribe(({ fabricantes, placasIntegradas }) => {
      this.fabricantes = fabricantes.results;
      this.placasIntegradas = placasIntegradas.results;

      this.initializeForm();
    });
  }

  initializeForm(): void {
    const processador = this.activatedRoute.snapshot.data['processador'];
  
    const fabricante = this.fabricantes.find(
      (f) => f.id === (processador?.fabricante?.id ?? null)
    );
    const placaIntegrada = this.placasIntegradas.find(
      (p) => p.id === (processador?.placaIntegrada?.id ?? null)
    );
  
    this.formGroup = this.formBuilder.group({
      id: [processador && processador.id ? processador.id : null],
      nome: [processador && processador.nome ? processador.nome : ''],
      socket: [processador && processador.socket ? processador.socket : ''],
      threads: [processador && processador.threads ? processador.threads : ''],
      nucleos: [processador && processador.nucleos ? processador.nucleos : ''],
      desbloqueado: [
        processador && processador.desbloqueado ? processador.desbloqueado : '',
      ],
      preco: [processador && processador.preco ? processador.preco : ''],
      fabricante: [fabricante && fabricante?.id ? fabricante : null],
      placaIntegrada: [placaIntegrada && placaIntegrada.id ? processador.placaIntegrada : null],
      memoriaCache: this.formBuilder.group({
        cacheL2: [
          processador.memoriaCache && processador.memoriaCache.cacheL2
            ? processador.memoriaCache.cacheL2 
            : '',
        ],
        cacheL3: [
          processador.memoriaCache && processador.memoriaCache.cacheL3
            ? processador.memoriaCache.cacheL3
            : '',
        ],
      }),
      frequencia: this.formBuilder.group({
        clockBasico: [
          processador.frequencia && processador.frequencia.clockBasico
            ? processador.frequencia.clockBasico
            : '',
        ],
        clockBoost: [
          processador.frequencia && processador.frequencia.clockBoost
            ? processador.frequencia.clockBoost
            : '',
        ],
      }),
      consumoEnergetico: this.formBuilder.group({
        energiaBasica: [
          processador.consumoEnergetico &&
          processador.consumoEnergetico.energiaBasica
            ? processador.consumoEnergetico.energiaBasica
            : '',
        ],
        energiaMaxima: [
          processador.consumoEnergetico &&
          processador.consumoEnergetico.energiaMaxima
            ? processador.consumoEnergetico.energiaMaxima
            : '',
        ],
      }),
      conectividade: this.formBuilder.group({
        pci: [
          processador && processador.conectividade.pci
            ? processador.conectividade.pci
            : '',
        ],
        tipoMemoria: [
          processador && processador.conectividade.tipoMemoria
            ? processador.conectividade.tipoMemoria
            : '',
        ],
        canaisMemoria: [
          processador && processador.conectividade.canaisMemoria
            ? processador.conectividade.canaisMemoria
            : '',
        ],
      }),
    });
  }
  
  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
  
      const processador = this.formGroup.value;
      console.log('Payload enviado:', this.formGroup.value);

      const operacao =
        processador.id == null
          ? this.processadorService.create(processador)
          : this.processadorService.update(processador);
  
      operacao.subscribe({
        next: () => {
          console.log('Processador salvo com sucesso');
          this.router.navigateByUrl('/admin/processadores');
          this.snackbarService.showSuccess('Processador salvo com sucesso');
        },
        error: (err) => {
          console.log('Erro ao salvar o processador' + JSON.stringify(err));
          this.errorHandling(err);
          this.snackbarService.showError('Erro ao salvar processador');
        },
      });
    }
  }
  

  onDelete() {
    if (this.formGroup.valid) {
      const processador = this.formGroup.value;
      if (processador.id != null) {
        this.processadorService.delete(processador).subscribe({ 
          next: () => {
            console.log('Processador excluido com sucesso');
            this.router.navigateByUrl('/admin/processadores');
            this.snackbarService.showSuccess('Processador deletado com sucesso');
          },
          error: (err) => {
            console.log('Erro ao excluir o processador' + JSON.stringify(err));
            this.snackbarService.showError('Erro ao deletar processador');
          },
        });
      }
    }
  }

  getErrorMessage(
    controlName: string,
    errors: ValidationErrors | null | undefined
  ): string {
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
      }
    } else if (httpError.status < 500) {
      this.snackbarService.showError(
        httpError.error?.message || 'Erro genérico no envio do formulário'
      );
    } else {
      this.snackbarService.showError(
        httpError.error?.message || 'Erro não mapeado do servidor'
      );
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' ',
    },
    socket: {
      required: 'O socket deve ser informado.',
    },
    threads: {
      required: 'O número de threads deve ser informado.',
      pattern: 'Informe um número inteiro positivo.',
    },
    nucleos: {
      required: 'O número de núcleos deve ser informado.',
      pattern: 'Informe um número inteiro positivo.',
    },
    desbloqueado: {
      required: 'Informe se o processador é desbloqueado.',
    },
    preco: {
      required: 'O preço deve ser informado.',
      pattern: 'Informe um valor decimal válido, ex: 199.99.',
    },
    fabricante: {
      required: 'O fabricante deve ser selecionado.',
    },
    'memoriaCache.cacheL2': {
      required: 'O valor da cache L2 deve ser informado.',
      pattern: 'Informe um número decimal válido para cache L2.',
    },
    'memoriaCache.cacheL3': {
      required: 'O valor da cache L3 deve ser informado.',
      pattern: 'Informe um número decimal válido para cache L3.',
    },
    'frequencia.clockBasico': {
      required: 'O clock básico deve ser informado.',
      pattern: 'Informe um número decimal válido para clock básico.',
    },
    'frequencia.clockBoost': {
      required: 'O clock boost deve ser informado.',
      pattern: 'Informe um número decimal válido para clock boost.',
    },
    'consumoEnergetico.energiaBasica': {
      required: 'A energia básica deve ser informada.',
      pattern: 'Informe um número inteiro positivo para energia básica.',
    },
    'consumoEnergetico.energiaMaxima': {
      pattern: 'Informe um número inteiro positivo para energia máxima.',
    },
    'conectividade.pci': {
      required: 'A versão do PCI deve ser informada.',
      pattern: 'Informe um número decimal válido para PCI.',
    },
    'conectividade.tipoMemoria': {
      required: 'O tipo de memória deve ser informado.',
    },
    'conectividade.canaisMemoria': {
      required: 'O número de canais de memória deve ser informado.',
      pattern: 'Informe um número inteiro positivo para canais de memória.',
    },
  };
}
