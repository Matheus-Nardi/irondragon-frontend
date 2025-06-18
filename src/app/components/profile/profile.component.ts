import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { UsuarioService } from '../../services/usuario.service';
import { FooterComponent } from '../template/footer/footer.component';
import { HeaderComponent } from '../template/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Usuario } from '../../models/usuario.model';
import { SnackbarService } from '../../services/snackbar.service';
import { DialogService } from '../../services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { EnderecoFormModalComponent } from '../endereco-form-modal/endereco-form-modal.component';
import { Endereco } from '../../models/endereco/endereco.model';
import { EnderecoService } from '../../services/endereco.service';
import { InfoUsuarioComponent } from './info-usuario/info-usuario.component';
import { EnderecosUsuarioComponent } from './enderecos-usuario/enderecos-usuario.component';
import { MatMenuModule } from '@angular/material/menu';
import { ListaDesejosComponent } from './lista-desejos/lista-desejos.component';
import { Processador } from '../../models/processador/processador.model';
import { PagamentosComponent } from './pagamentos/pagamentos.component';
import { Cartao } from '../../models/cartao.model';
import { CartaoFormModalComponent } from '../cartao-form-modal/cartao-form-modal.component';
import { CartaoService } from '../../services/cartao.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { PedidosComponent } from "./pedidos/pedidos.component";
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { HeaderAdminComponent } from "../template/header-admin/header-admin.component";
import { FooterClienteComponent } from "../template/footer-cliente/footer-cliente.component";

@Component({
  selector: 'app-profile',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
    HeaderComponent,
    FooterComponent,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    InfoUsuarioComponent,
    EnderecosUsuarioComponent,
    MatMenuModule,
    ListaDesejosComponent,
    PagamentosComponent,
    PedidosComponent,
    RouterOutlet,
    HeaderAdminComponent,
    FooterClienteComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  cartoes: Cartao[] = [];
  enderecos: Endereco[] = [];
  listaDesejos: Processador[] = [];
  pedidos: Pedido[] = [];
  editandoInfoPessoais = false;
  formInfoPessoais!: FormGroup;
  keycloakProfile?: Keycloak.KeycloakProfile;
  usuario!: Usuario;
  cliente!: Cliente;
  fileName: string = '';
  selectedFile: File | null = null;
  imagemUrl: string = '';

  roles: any = [];

  page = 0;
  pageSize = 10;
  totalRecords = 0;

  selectedTabIndex = 0;

  ngOnInit(): void {
    this.keycloakService.getUserProfile().then((profile) => {
      this.keycloakProfile = profile;
      console.log('Keycloak profile:', profile);
      this.roles = this.keycloakService.getUserRoles()
      if (profile?.email) {
        this.loadCliente(profile);
        this.loadUsuario(profile);

        if (this.cliente?.usuario?.id && this.cliente?.usuario?.nomeImagem) {
          this.imagemUrl = this.usuarioService.getUrlImage(
            this.cliente.usuario.id.toString(),
            this.cliente.usuario.nomeImagem
          );
        }
      }
    });

    this.route.firstChild?.url.subscribe(url => {
      const path = url[0]?.path;
      switch (path) {
        case 'dados':
          this.selectedTabIndex = 0;
          break;
        case 'pagamentos':
        case 'carteira':
          this.selectedTabIndex = 1;
          break;
        case 'desejos':
          this.selectedTabIndex = 2;
          break;
        case 'pedidos':
          this.selectedTabIndex = 3;
          break;
        default:
          this.selectedTabIndex = 0;
      }
    });
  }

  constructor(
    private keycloakService: KeycloakOperationService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private snackbarService: SnackbarService,
    private matDialog: MatDialog,
    private matDialogConfirmService: DialogService,
    private enderecoService: EnderecoService,
    private cartaoService: CartaoService,
    private pedidoService: PedidoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  isAdminOrSuperAdmin(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Super');
  }

  private loadCliente(profile: any) {
    this.clienteService.findByUsername(profile.email).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        console.log('Cliente: ', cliente);
        this.loadListaDesejos();
        this.loadCartoes();
        this.loadPedidos();
      },
      error: (error) => {
        console.log('Erro na requisição', error);
      },
    });

  }

  private loadUsuario(profile: any) {
    this.usuarioService.findByUsername(profile.email).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        if (this.cliente) {
        this.cliente.usuario = usuario;
      }
        console.log('Usuário: ', usuario);
        
        this.imagemUrl = this.usuarioService.getUrlImage(
          this.usuario.id.toString(),
          this.usuario.nomeImagem
        );
      },
      error: (error) => {
        console.log('Erro na requisição', error);
      },
    });
  }

  loadListaDesejos() {
    this.clienteService.getListaDesejos().subscribe((lista) => {
      this.listaDesejos = lista;
      console.log(this.listaDesejos);
    });
  }

  loadEnderecos() {
    this.enderecoService.getByUsuario().subscribe((enderecos) => {
      this.enderecos = enderecos;
      this.cliente.usuario.enderecos = this.enderecos;
    });
  }

  loadCartoes() {
    this.cartaoService.getByUsuario().subscribe((cartoes) => {
      this.cartoes = cartoes;
      this.cliente.listaDeCartoes = this.cartoes;
      console.log(this.cartoes);
    });
  }

  loadPedidos(page = 0, pageSize = 10) {
    this.pedidoService.getByUsername(page, pageSize).subscribe((pedidos) => {
      this.pedidos = pedidos.results;
      this.totalRecords = pedidos.count;
      console.log('Pedidos', pedidos);

    })
  }

  onPaginar(event: { pageIndex: number, pageSize: number }) {
    this.loadPedidos(event.pageIndex, event.pageSize);
  }

  atualizarInfoBasicas(update: {
    nome: string;
    dataNascimento: Date | null;
    telefone: { codigoArea: string; numero: string };
  }) {
    this.usuarioService.updateInfoBasica(update).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Informações atualizadas com sucesso');
        this.loadUsuario(this.keycloakProfile); 
         window.location.reload();
      },
      error: () => {
        this.snackbarService.showError('Erro ao atualizar informações');
      },
    });
  }

  abrirModalEndereco(endereco: Endereco | null) {
    const enderecoParaModal = endereco ? { ...endereco } : ({} as Endereco);

    this.matDialog
      .open(EnderecoFormModalComponent, {
        width: 'auto',
        data: enderecoParaModal,
      })
      .afterClosed()
      .subscribe((enderecoAtualizado: Endereco) => {
        if (!enderecoAtualizado) return;

        const operacao$ = enderecoAtualizado.id
          ? this.enderecoService.update(enderecoAtualizado)
          : this.enderecoService.create(enderecoAtualizado);

        operacao$.subscribe({
          next: () => {
            this.snackbarService.showSuccess('Endereço salvo com sucesso');
            this.loadEnderecos();
          },
          error: () => {
            this.snackbarService.showError('Erro ao salvar o endereço');
          },
        });
      });
  }

  abrirModalCartao(cartao: Cartao | null) {
    const cartaoParaModal = cartao ? { ...cartao } : ({} as Cartao);
    console.log('Cartão :', cartaoParaModal);
    
    this.matDialog
      .open(CartaoFormModalComponent, {
        width: 'auto',
        data: cartaoParaModal,
      })
      .afterClosed()
      .subscribe((cartaoAtualizado: Cartao) => {
        if (!cartaoAtualizado) return;
        console.log("ID", cartaoAtualizado.id);
        
        const operacao$ = cartaoAtualizado.id
          ? this.cartaoService.update(cartaoAtualizado)
          : this.cartaoService.create(cartaoAtualizado);

     
        
        operacao$.subscribe({
          next: () => {
            this.snackbarService.showSuccess('Cartão salvo com sucesso');
            this.loadCartoes();
          },
          error: () => {
            this.snackbarService.showError('Erro ao salvar o cartão');
          },
        });
      });
  }

  deletarEndereco(endereco: Endereco) {
    this.matDialogConfirmService
      .openConfirmDialog(
        'Deletar Endereço',
        'Deseja realmente deletar este endereço?',
        'warning'
      )
      .subscribe((confirmou) => {
        if (!confirmou) return;
        this.enderecoService.delete(endereco).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Endereço deletado com sucesso');
            this.loadEnderecos();
          },
          error: () => {
            this.snackbarService.showError('Erro ao deletar o endereço');
          },
        });
      });
  }

  deletarCartao(cartao: Cartao) {
    this.matDialogConfirmService
      .openConfirmDialog(
        'Deletar Cartão',
        'Deseja realmente deletar este cartão?',
        'warning'
      )
      .subscribe((confirmou) => {
        if (!confirmou) return;
        this.cartaoService.delete(cartao).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Cartão deletado com sucesso');
            this.loadCartoes();
          },
          error: () => {
            this.snackbarService.showError('Erro ao deletar o cartão');
          },
        });
      });
  }

  carregarImagemSelecionada(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processarArquivo(file);

      if (this.cliente?.usuario?.id) {
        this.uploadImage(this.cliente.usuario.id);
      }
    }
  }

  processarArquivo(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      this.snackbarService.showError(
        'Arquivo muito grande. O tamanho máximo é 10MB.'
      );
      return;
    }

    this.fileName = file.name;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  private uploadImage(usuarioId: number) {
    if (this.selectedFile) {
      this.usuarioService
        .uploadImage(usuarioId, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => {
            this.snackbarService.showSuccess('Imagem enviada com sucesso');
            this.loadUsuario(this.keycloakProfile);
            this.loadCliente(this.keycloakProfile);
          },
          error: (err) => {
            console.log('Erro ao fazer o upload da imagem', err);
            this.snackbarService.showError('Erro ao enviar a imagem');
          },
        });
    }
  }

  removerImagem() {
    this.imagemUrl = 'null';

    if (this.cliente && this.cliente.usuario) {
      this.cliente.usuario.nomeImagem = '';
    }

    this.snackbarService.showSuccess('Imagem removida com sucesso');
  }

  removerDesejo(processador: Processador) {
    this.clienteService.removeFromListaDeDesejos(processador.id).subscribe({
      next: () => {
        this.snackbarService.showSuccess(
          'Processador removido da lista de desejos'
        );
        this.loadListaDesejos();
      },
      error: () => {
        this.snackbarService.showError('Erro ao remover o processador');
      },
    });
  }

  onTabChange(event: any) {
    const tabRoutes = ['dados', 'carteira', 'desejos', 'pedidos'];
    if (event.index >= 0 && event.index < tabRoutes.length) {
      this.router.navigate([tabRoutes[event.index]], { relativeTo: this.route });
    }
  }
}
