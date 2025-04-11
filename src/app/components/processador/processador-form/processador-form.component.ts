import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    MatButtonModule
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
  ) {}

  ngOnInit(): void {
    this.fabricanteService.findAll().subscribe(fabData => {
      this.fabricantes = fabData.results;
      this.placaIntegradaService.findAll().subscribe(placaData => {
        this.placasIntegradas = placaData.results;
        this.initializeForm();
      });
    });
  }

  initializeForm(): void {
    const processador = this.activatedRoute.snapshot.data['processador'];
  
    const fabricante = processador?.fabricante
      ? this.fabricantes.find(f => f.id === processador.fabricante.id)
      : null;
  
    const placaIntegrada = processador?.placaIntegrada
      ? this.placasIntegradas.find(p => p.id === processador.placaIntegrada.id)
      : null;
  
      this.formGroup = this.formBuilder.group({
        id: [processador && processador.id ? processador.id : null],
        nome: [processador && processador.nome ? processador.nome : null],
        socket: [processador && processador.socket ? processador.socket : null],
        threads: [processador && processador.threads ? processador.threads : null],
        desbloqueado: [processador && processador.desbloqueado ? processador.desbloqueado : null],
        preco: [processador && processador.preco ? processador.preco : null],
        fabricante: [fabricante && fabricante.id ? processador.fabricante.id : null],
        placaIntegrada: [placaIntegrada && placaIntegrada.id ? processador.placaIntegrada.id : null],
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
  }

  onDelete(): void {
  }
  
}
