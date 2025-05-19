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
import { EnderecosUsuarioComponent } from "./enderecos-usuario/enderecos-usuario.component";

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
    EnderecosUsuarioComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  enderecos: Endereco[] = [];
  editandoInfoPessoais = false;
  formInfoPessoais!: FormGroup;
  keycloakProfile?: Keycloak.KeycloakProfile;
  usuario!: Usuario;
  cliente!: Cliente;

  ngOnInit(): void {
    this.keycloakService.getUserProfile().then((profile) => {
      this.keycloakProfile = profile;
      console.log('Keycloak profile:', profile);

      if (profile?.email) {
        this.loadCliente(profile);
        this.loadUsuario(profile);
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
    private enderecoService: EnderecoService
  ) {}

  private loadCliente(profile: any) {
    this.clienteService.findByUsername(profile.email).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        console.log('Cliente: ', cliente);
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
      },
      error: (error) => {
        console.log('Erro na requisição', error);
      },
    });
  }

  loadListaDesejos() {
    this.clienteService.getListaDesejos().subscribe((lista) => {
      this.cliente.listaDeDesejos = lista;
    });
  }

  loadEnderecos() {
    this.enderecoService.getByUsuario().subscribe((enderecos) => {
      this.enderecos = enderecos;
      this.cliente.usuario.enderecos = this.enderecos;
    });
  }

  atualizarInfoBasicas(update: {
    nome: string;
    dataNascimento: Date | null;
    telefone: { codigoArea: string; numero: string };
  }) {
    this.usuarioService.updateInfoBasica(update).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Informações atualizadas com sucesso');
        this.loadCliente(this.keycloakProfile); // recarrega os dados
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

  deletarEndereco(endereco: Endereco) {
    this.matDialogConfirmService
      .openConfirmDialog('Deletar Endereço', 'Deseja realmente deletar este endereço?', 'warning')
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
}
