import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Processador } from '../../../models/processador/processador.model';
import { ClienteService } from '../../../services/cliente.service';
import { KeycloakOperationService } from '../../../services/keycloak.service';
import { ProcessadorService } from '../../../services/processador.service';
import { LoteService } from '../../../services/lote.service';
import { Lote } from '../../../models/lote.model';
import { PedidoService } from '../../../services/pedido.service';
import { EMPTY, forkJoin, from, of } from 'rxjs'; // Importar EMPTY e forkJoin
import { switchMap, tap, catchError, finalize } from 'rxjs/operators'; // Importar operadores
import { SnackbarService } from '../../../services/snackbar.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { NgIf } from '@angular/common';

type Card = {
  id: number;
  title: string;
  fabricante: string;
  preco: number;
  imageUrl: string;
  specs: {
    nucleos: number;
    threads: number;
  };
  isFavorite?: boolean;
};
@Component({
  selector: 'app-processador-card-list',
  imports: [
    MatCardModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './processador-card-list.component.html',
  styleUrl: './processador-card-list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProcessadorCardListComponent implements OnInit {
  cliente!: Cliente;
  keycloakProfile?: Keycloak.KeycloakProfile;
  listaDesejos: Processador[] = []; // Inicializar para evitar undefined
  page = 0;
  pageSize = 10;
  totalRecords = 0;
  processadoresMaisVendidos: Processador[] = [];
  lastLotesByProcessadores: Lote[] = [];
  cardsMaisVendidos = signal<Card[]>([]);
  cardsLastLotes = signal<Card[]>([]);

  // Sinal para controlar o carregamento e evitar chamadas múltiplas
  isLoadingProfileAndClient = signal(false);

  constructor(
    private processadorService: ProcessadorService,
    private clienteService: ClienteService,
    private keycloakService: KeycloakOperationService,
    private loteService: LoteService,
    private pedidoService: PedidoService,
    private router: Router,
    private snackbarService: SnackbarService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    // Carrega os dados que não dependem do cliente/lista de desejos imediatamente
    this.loadInitialData();

    // Lógica de carregamento do perfil e cliente
    this.loadProfileAndClientData();
  }

  private loadProfileAndClientData(): void {
    if (this.isLoadingProfileAndClient()) return;
    this.isLoadingProfileAndClient.set(true);

    // Converter a Promise para Observable usando 'from'
    from(this.keycloakService.getUserProfile())
      .pipe(
        tap((profile) => {
          // Atribuir o perfil aqui, garantindo que keycloakProfile tenha o tipo correto
          this.keycloakProfile = profile;
          console.log('Keycloak profile:', profile);
        }),
        switchMap((profile) => {
          // Agora 'profile' deve ter o tipo Keycloak.KeycloakProfile | undefined
          if (profile && profile.email) {
            // Checar se profile e profile.email existem
            return this.clienteService.findByUsername(profile.email).pipe(
              tap((cliente) => {
                if (cliente) {
                  // Verificar se cliente foi encontrado
                  this.cliente = cliente;
                  console.log('Cliente:', cliente);
                } else {
                  console.warn(
                    `Cliente não encontrado para o email: ${profile.email}`
                  );
                  // Tratar o caso de cliente não encontrado, talvez limpando this.cliente
                  // this.cliente = undefined; // ou algum valor padrão
                }
              }),
              switchMap((cliente) => {
                if (cliente) {
                  // Só busca lista de desejos se o cliente existe
                  return this.clienteService.getListaDesejos();
                }
                // Se o cliente não foi encontrado ou não tem email, retorna uma lista de desejos vazia
                return of([]);
              }),
              catchError((err) => {
                console.error(
                  'Erro ao buscar cliente ou lista de desejos:',
                  err
                );
                return of([]); // Retorna lista de desejos vazia em caso de erro no fluxo do cliente
              })
            );
          }
          // Se não há perfil ou email, retorna um Observable com uma lista de desejos vazia
          console.log('Perfil Keycloak não encontrado ou sem email.');
          return of([]);
        }),
        finalize(() => this.isLoadingProfileAndClient.set(false))
      )
      .subscribe({
        next: (listaDesejos) => {
          this.listaDesejos = listaDesejos;
          console.log('Lista de desejos carregada final:', this.listaDesejos);
          this.updateAllCardLists();
        },
        error: (error) => {
          console.error(
            'Erro no fluxo de carregamento do perfil/cliente:',
            error
          );
          this.listaDesejos = [];
          this.updateAllCardLists();
        },
      });
  }

  private loadInitialData(): void {
    // Usar forkJoin para carregar dados em paralelo se eles não dependerem um do outro
    // Aqui, estamos assumindo que loadProcessadoresMaisVendidosData e loadLastLotesData
    // não precisam esperar um pelo outro.
    forkJoin({
      maisVendidos: this.pedidoService.findProcessadoresMaisPedidos(),
      lastLotes: this.loteService.findLastLotes(),
    }).subscribe({
      next: (results) => {
        this.processadoresMaisVendidos = results.maisVendidos;
        this.lastLotesByProcessadores = results.lastLotes;
        console.log(
          'Processadores mais vendidos DATA:',
          this.processadoresMaisVendidos
        );
        console.log('Ultimos lotes DATA:', this.lastLotesByProcessadores);
        // Mapeia para cards. Se listaDesejos ainda não carregou, isFavorite será false.
        // Será atualizado quando loadProfileAndClientData completar.
        this.updateAllCardLists();
      },
      error: (err) => {
        console.error(
          'Erro ao carregar dados iniciais de processadores/lotes:',
          err
        );
      },
    });
  }

  // Método unificado para (re)mapear todos os cards
  private updateAllCardLists(): void {
    this.loadCardsMaisVendidos();
    this.loadCardsLastProcessadores();
  }

  private mapToCard(processador: Processador): Card {
    const currentListaDesejos = this.listaDesejos || [];
    const isFavorite = currentListaDesejos.some((p) => p.id === processador.id);
    const imageUrl =
      processador.imagens && processador.imagens.length > 0
        ? this.processadorService.getUrlImage(
            processador.id.toString(),
            processador.imagens.find((img) => img.principal)?.imagem || ''
          )
        : 'assets/images/placeholder.png';

    return {
      id: processador.id,
      title: processador.nome,
      fabricante: processador.fabricante.nome,
      preco: processador.preco,
      imageUrl: imageUrl,
      specs: {
        nucleos: processador.nucleos,
        threads: processador.threads,
      },
      isFavorite: isFavorite,
    };
  }

  loadCardsLastProcessadores() {
    if (this.lastLotesByProcessadores.length > 0) {
      const cards = this.lastLotesByProcessadores.map((lote) =>
        this.mapToCard(lote.processador)
      );
      this.cardsLastLotes.set(cards);
    } else {
      this.cardsLastLotes.set([]); // Limpa se não houver dados
    }
  }

  loadCardsMaisVendidos() {
    if (this.processadoresMaisVendidos.length > 0) {
      const cards = this.processadoresMaisVendidos.map((processador) =>
        this.mapToCard(processador)
      );
      this.cardsMaisVendidos.set(cards);
    } else {
      this.cardsMaisVendidos.set([]); // Limpa se não houver dados
    }
  }

  toggleFavorite(card: Card) {
    if (!this.cliente) {
      console.warn('Cliente não carregado, não é possível alterar favoritos.');
      this.snackbarService.showWarning('Você precisa estar logado para favoritar.', 
        {
          label: 'Login',
          action: () => this.keycloakService.login('/'),
        }
      );
      return;
    }

    const action$ = card.isFavorite
      ? this.clienteService.removeFromListaDeDesejos(card.id)
      : this.clienteService.addToListaDeDesejos(card.id);

    action$
      .pipe(
        // Após a ação, recarrega a lista de desejos para ter o estado mais atual
        switchMap(() => this.clienteService.getListaDesejos())
      )
      .subscribe({
        next: (updatedListaDesejos) => {
          this.listaDesejos = updatedListaDesejos;
          // Atualiza todos os cards para refletir a mudança no status de favorito
          this.updateAllCardLists();
        },
        error: (err) => {
          console.error('Erro ao atualizar favorito:', err);
          // Poderia tentar reverter a UI ou mostrar uma mensagem de erro.
        },
      });
  }

  navegarParaDetalhes(card: any) {
    this.router.navigate(['/processadores', card.id]);
  }

  addToCart(card: Card, event: MouseEvent): void {
    event.stopPropagation();

    this.processadorService.findById(card.id.toString()).subscribe({
      next: (proc) => {
        this.carrinhoService.adicionar({
          id: proc.id,
          nome: proc.nome,
          quantidade: 1,
          preco: proc.preco,
          imagem: proc.imagens.find((img) => img.principal)?.nomeImagem || '',
        });
      },
      error: (err) => {
        console.error('Erro ao buscar processador:', err);
        this.snackbarService.showError(
          'Não foi possível adicionar ao carrinho.'
        );
      },
    });
  }
}
