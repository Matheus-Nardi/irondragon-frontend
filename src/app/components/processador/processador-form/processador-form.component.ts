import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Fabricante } from '../../../models/fabricante.model';
import { PlacaIntegrada } from '../../../models/processador/placaintegrada.model';
import { Processador } from '../../../models/processador/processador.model';
import { FabricanteService } from '../../../services/fabricante.service';
import { PlacaintegradaService } from '../../../services/placaintegrada.service';
import { ProcessadorService } from '../../../services/processador.service';
import { SnackbarService } from '../../../services/snackbar.service';

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
    MatStepperModule,
    MatProgressBarModule
  ],
  styleUrls: ['./processador-form.component.css'],
})
export class ProcessadorFormComponent implements OnInit {
  formGroup!: FormGroup;
  formGroupInfosBasicas!: FormGroup;
  formGroupInfosEspecificas!: FormGroup;
  fabricantes: Fabricante[] = [];
  placasIntegradas: PlacaIntegrada[] = [];

  isUploading = false;
  isDragOver = false;
  fileName: string = '';
  selectedFile: File[] = [];
  imagePreview: string[] = [];
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  existingImages: string[] = [];
  imagensRemovidas: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private processadorService: ProcessadorService,
    private fabricanteService: FabricanteService,
    private placaIntegradaService: PlacaintegradaService,
    private router: Router,
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.formGroupInfosBasicas = this.formBuilder.group({
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
    });

    this.formGroupInfosEspecificas = this.formBuilder.group({
      cacheL2: [
        '',
        [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
      ],
      cacheL3: [
        '',
        [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
      ],
      clockBasico: [
        '',
        [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
      ],
      clockBoost: [
        '',
        [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')],
      ],
      energiaBasica: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      energiaMaxima: ['', [Validators.pattern('^[1-9][0-9]*$')]],
      pci: ['', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]],
      tipoMemoria: ['', Validators.required],
      canaisMemoria: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
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
    const processador: Processador =
      this.activatedRoute.snapshot.data['processador'];

    const fabricante = this.fabricantes.find(
      (f) => f.id === (processador?.fabricante?.id ?? null)
    );
    const placaIntegrada = this.placasIntegradas.find(
      (p) => p.id === (processador?.placaIntegrada?.id ?? null)
    );

    if (processador && processador.imagens && processador.imagens.length > 0) {
      this.existingImages = [...processador.imagens];
    }

    this.formGroupInfosBasicas = this.formBuilder.group({
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
      placaIntegrada: [
        placaIntegrada && placaIntegrada.id ? processador.placaIntegrada : null,
      ],
    });

    this.formGroupInfosEspecificas = this.formBuilder.group({
      cacheL2: [processador?.memoriaCache?.cacheL2 ?? ''],
      cacheL3: [processador?.memoriaCache?.cacheL3 ?? ''],
      clockBasico: [processador?.frequencia?.clockBasico ?? ''],
      clockBoost: [processador?.frequencia?.clockBoost ?? ''],
      energiaBasica: [processador?.consumoEnergetico?.energiaBasica ?? ''],
      energiaMaxima: [processador?.consumoEnergetico?.energiaMaxima ?? ''],
      pci: [processador?.conectividade?.pci ?? ''],
      tipoMemoria: [processador?.conectividade?.tipoMemoria ?? ''],
      canaisMemoria: [processador?.conectividade?.canaisMemoria ?? ''],
    });
  }
  onSubmit(): void {
    this.formGroupInfosBasicas.markAllAsTouched();
    this.formGroupInfosEspecificas.markAllAsTouched();

    if (
      this.formGroupInfosBasicas.valid &&
      this.formGroupInfosEspecificas.valid
    ) {
      const infosBasicas = this.formGroupInfosBasicas.value;
      const infosEspecificas = this.formGroupInfosEspecificas.value;

      // Combine os valores dos dois formGroups em um único objeto 'processador'
      const processador = {
        id: infosBasicas.id,
        nome: infosBasicas.nome,
        socket: infosBasicas.socket,
        threads: infosBasicas.threads,
        nucleos: infosBasicas.nucleos,
        desbloqueado: infosBasicas.desbloqueado,
        preco: infosBasicas.preco,
        fabricante: infosBasicas.fabricante,
        placaIntegrada: infosBasicas.placaIntegrada,
        memoriaCache: {
          cacheL2: infosEspecificas.cacheL2,
          cacheL3: infosEspecificas.cacheL3,
        },
        frequencia: {
          clockBasico: infosEspecificas.clockBasico,
          clockBoost: infosEspecificas.clockBoost,
        },
        consumoEnergetico: {
          energiaBasica: infosEspecificas.energiaBasica,
          energiaMaxima: infosEspecificas.energiaMaxima,
        },
        conectividade: {
          pci: infosEspecificas.pci,
          tipoMemoria: infosEspecificas.tipoMemoria,
          canaisMemoria: infosEspecificas.canaisMemoria,
        },
      } as Processador;

      console.log('Payload enviado:', processador);

      const operacao =
        processador.id == null
          ? this.processadorService.create(processador)
          : this.processadorService.update(processador);

      operacao.subscribe({
        next: (processadorSalvo: Processador) => {
          console.log('Processador salvo com sucesso');
          // Se for update, processadorSalvo será null (204 No Content)
          const id = processadorSalvo?.id ?? this.formGroupInfosBasicas.get('id')?.value;
          if (id) {
            this.uploadImages(id);
          } else {
            this.snackbarService.showError('Erro: ID do processador não encontrado.');
          }
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
            this.snackbarService.showSuccess(
              'Processador deletado com sucesso'
            );
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


  voltarPagina() {
    this.location.back();
  }

  // Método para remover a imagem selecionada
  removerImagem(index: number) {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  removerImagemExistente(index: number) {
    const removida = this.existingImages.splice(index, 1)[0];
    if (removida) {
      this.imagensRemovidas.push(removida);
    }
  }

  limparImagens(){
    this.selectedFiles = [];
    this.imagePreviews = [];
  }

  getExistingImageUrl(img: string): string {
  return this.processadorService.getUrlImage(
    this.formGroupInfosBasicas.get('id')?.value,
    img
  );
}


  // Método para processar o arquivo selecionado
  processarArquivos(files: FileList) {
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        this.snackbarService.showError('Arquivo muito grande. O tamanho máximo é 10MB.');
        return;
      }
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // Substituição do método existente
  carregarImagensSelecionadas(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processarArquivos(input.files);
    }
  }


  private uploadImages(processadorId: number) {
    if (this.selectedFiles.length > 0) {
      this.isUploading = true;
      const uploads = this.selectedFiles.map(file =>
        this.processadorService.uploadImage(processadorId, file.name, file)
      );
      forkJoin(uploads).subscribe({
        next: () => {
          this.isUploading = false;
          this.snackbarService.showSuccess('Imagens enviadas com sucesso');
          this.router.navigateByUrl('/admin/processadores');
        },
        error: (err) => {
          this.isUploading = false;
          this.snackbarService.showError('Erro ao enviar as imagens');
        },
      });
    } else {
      this.voltarPagina();
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
