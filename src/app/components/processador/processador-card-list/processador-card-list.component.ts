import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Processador } from '../../../models/processador/processador.model';
import { ClienteService } from '../../../services/cliente.service';
import { KeycloakOperationService } from '../../../services/keycloak.service';
import { ProcessadorService } from '../../../services/processador.service';
import { CarrinhoService } from '../../../services/carrinho.service';

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
    RouterLink
  ],
  templateUrl: './processador-card-list.component.html',
  styleUrl: './processador-card-list.component.css',
})
export class ProcessadorCardListComponent implements OnInit {
  cliente!: Cliente;
  keycloakProfile?: Keycloak.KeycloakProfile;
  listaDesejos: Processador[] = [];
  page = 0;
  pageSize = 10;
  totalRecords = 0;
  processadores: Processador[] = [];
  cards = signal<Card[]>([]);

  constructor(
    private processadorService: ProcessadorService,
    private clienteService: ClienteService,
    private keycloakService: KeycloakOperationService
  ) {}
  ngOnInit(): void {
    this.loadProcessadores();
    this.keycloakService.getUserProfile().then((profile) => {
      this.keycloakProfile = profile;
      console.log('Keycloak profile:', profile);

      if (profile?.email) {
        this.loadCliente(profile);
      }
    });
  }

  private loadCliente(profile: any) {
    this.clienteService.findByUsername(profile.email).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        console.log('Cliente: ', cliente);

        this.clienteService.getListaDesejos().subscribe({
          next: (lista) => {
            this.listaDesejos = lista;
            console.log('Obtendo lista de desejos: ', lista);

            // Após obter a lista de desejos, carregue os processadores
            this.loadCards();
          },
          error: (error) => {
            console.log('Erro ao obter lista de desejos', error);
          },
        });
      },
      error: (error) => {
        console.log('Erro ao buscar cliente', error);
      },
    });
  }

  loadProcessadores() {
    this.processadorService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => {
        this.totalRecords = data.count;
        this.processadores = data.results;
        this.loadCards();
      });
  }

  loadCards() {
    const cards = this.processadores.map((processador) => {
      const isFavorite = this.listaDesejos.some((p) => p.id === processador.id);
      return {
        id: processador.id,
        title: processador.nome,
        fabricante: processador.fabricante.nome,
        preco: processador.preco,
        imageUrl: this.processadorService.getUrlImage(
          processador.id.toString(),
          processador.imagens[0]
        ),
        specs: {
          nucleos: processador.nucleos,
          threads: processador.threads,
        },
        isFavorite: isFavorite,
      };
    });

    this.cards.set(cards);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProcessadores();
  }

  toggleFavorite(card: Card) {
    const action$ = card.isFavorite
      ? this.clienteService.removeFromListaDeDesejos(card.id)
      : this.clienteService.addToListaDeDesejos(card.id);

    action$.subscribe({
      next: () => {
        const updatedCards = this.cards().map((c) =>
          c.id === card.id ? { ...c, isFavorite: !c.isFavorite } : c
        );
        this.cards.set(updatedCards);
      },
      error: (err) => {
        console.error('Erro ao atualizar favorito:', err);
      },
    });
  }
}
