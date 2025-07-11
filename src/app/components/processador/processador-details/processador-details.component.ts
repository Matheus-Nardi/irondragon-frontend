import { Component, CUSTOM_ELEMENTS_SCHEMA, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProcessadorService } from '../../../services/processador.service';
import type { Processador } from '../../../models/processador/processador.model';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClienteService } from '../../../services/cliente.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { KeycloakOperationService } from '../../../services/keycloak.service';
import { Cliente } from '../../../models/cliente.model';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-processador-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './processador-details.component.html',
  styleUrl: './processador-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProcessadorDetailsComponent implements OnInit {
  cliente!: Cliente;
  keycloakProfile?: Keycloak.KeycloakProfile;
  imageUrls: string[] = [];
  listaDesejos: Processador[] = [];
  processador!: Processador;
  selectedImageIndex = 0;
  quantity = 1;
  isComparing = false;
  loading = true;
  error = false;

  specCategories = [
    {
      name: 'Informações Básicas',
      icon: 'info',
      specs: [] as { label: string; value: string }[],
    },
    {
      name: 'Desempenho',
      icon: 'speed',
      specs: [] as { label: string; value: string }[],
    },
    {
      name: 'Compatibilidade',
      icon: 'settings',
      specs: [] as { label: string; value: string }[],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private processadorService: ProcessadorService,
    private keycloakService: KeycloakOperationService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.loadListaDesejos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.processadorService.findById(id).subscribe({
        next: (processador) => {
          this.processador = processador;
          console.log(processador);
          this.imageUrls = processador.imagens.map((img) =>
            this.processadorService.getUrlImage(
              processador.id.toString(),
              img.imagem
            )
          );
          this.loading = false;
          this.organizarEspecificacoes();
        },
        error: (error) => {
          console.error('Erro ao carregar o processador', error);
          this.loading = false;
          this.error = true;
        },
      });
    } else {
      this.loading = false;
    }
  }

  loadListaDesejos() {
    this.clienteService.getListaDesejos().subscribe((lista) => {
      this.listaDesejos = lista;
      console.log(this.listaDesejos);

      if (this.processador) {
        this.processador.isFavorite = this.listaDesejos.some(
          (p) => p.id === this.processador.id
        );
      }
    });
  }

  organizarEspecificacoes(): void {
    if (!this.processador) return;

    // Informações Básicas
    this.specCategories[0].specs = [
      { label: 'Fabricante', value: this.processador.fabricante.nome },
      { label: 'Modelo', value: this.processador.nome },
    ];

    // Desempenho
    this.specCategories[1].specs = [
      { label: 'Núcleos', value: this.processador.nucleos.toString() },
      { label: 'Threads', value: this.processador.threads.toString() },
      {
        label: 'Frequência Base',
        value: this.processador.frequencia.clockBasico
          ? `${this.processador.frequencia.clockBasico} GHz`
          : 'N/A',
      },
      {
        label: 'Frequência Turbo',
        value: this.processador.frequencia.clockBoost
          ? `${this.processador.frequencia.clockBoost} GHz`
          : 'N/A',
      },
      {
        label: 'Cache L3',
        value: this.processador.memoriaCache.cacheL3
          ? `${this.processador.memoriaCache.cacheL3} MB`
          : 'N/A',
      },
    ];

    // Compatibilidade
    this.specCategories[2].specs = [
      { label: 'Socket', value: this.processador.socket },
    ];

    if (this.processador.placaIntegrada) {
      this.specCategories[2].specs.push(
        {
          label: 'Gráficos Integrados',
          value: `Sim - ${this.processador.placaIntegrada.nome}`,
        },
        {
          label: 'DirectX',
          value: this.processador.placaIntegrada.directX.toString(),
        },
        {
          label: 'OpenGL',
          value: this.processador.placaIntegrada.openGl.toString(),
        },
        {
          label: 'Vulkan',
          value: this.processador.placaIntegrada.vulkan.toString(),
        }
      );
    } else {
      this.specCategories[2].specs.push({
        label: 'Gráficos Integrados',
        value: 'Não',
      });
    }
  }

  changeImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getImagemUrl(processador: Processador): string {
    return this.processadorService.getUrlImage(
      processador.id.toString(),
      processador.imagens.find((img) => img.principal)?.imagem || ''
    );
  }

  toggleFavorite() {
    if (this.keycloakService.isLoggedIn() === false) {
      console.warn('Cliente não carregado, não é possível alterar favoritos.');
      this.snackbarService.showWarning(
        'Você precisa estar logado para favoritar.',
        {
          label: 'Login',
          action: () => this.keycloakService.login('/'),
        }
      );
      return;
    }
    const isCurrentlyFavorite = this.processador.isFavorite;
    const action$ = isCurrentlyFavorite
      ? this.clienteService.removeFromListaDeDesejos(this.processador.id)
      : this.clienteService.addToListaDeDesejos(this.processador.id);

    action$.subscribe({
      next: () => {
        // Atualiza estado local com nova referência para Angular detectar mudança
        this.processador = {
          ...this.processador,
          isFavorite: !isCurrentlyFavorite,
        };

        this.loadListaDesejos();

        console.log(
          this.processador.isFavorite ? 'Favoritou' : 'Não é mais favorito'
        );
      },
      error: (err) => {
        console.error('Erro ao atualizar favorito:', err);
      },
    });
  }

  addToCart(processador: Processador): void {
    this.snackBar.open(
      `${this.quantity} unidade(s) adicionada(s) ao carrinho`,
      'Ver Carrinho',
      {
        duration: 3000,
      }
    );

    this.carrinhoService.adicionar({
      id: processador.id,
      nome: processador.nome,
      quantidade: this.quantity,
      preco: processador.preco,
      imagem:
        processador.imagens.find((img) => img.principal)?.nomeImagem || '',
    });
  }

  buyNow(): void {
    this.snackBar.open('Redirecionando para o checkout...', 'Fechar', {
      duration: 2000,
    });
    // Aqui você redirecionaria para a página de checkout
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    this.quantity--;
  }
}
