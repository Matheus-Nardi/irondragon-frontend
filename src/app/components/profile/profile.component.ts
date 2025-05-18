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
    DatePipe,
    HeaderComponent,
    FooterComponent,
    MatExpansionModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    MatTableModule,
    MatTabsModule,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
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
      }
    });
  }

  constructor(
    private keycloakService: KeycloakOperationService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private matDialog: MatDialog,
    private enderecoService: EnderecoService
  ) {}

  private loadCliente(profile: any) {
    this.clienteService.findByUsername(profile.email).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        console.log('Cliente: ', cliente);
        this.criarFormulario();
        console.log(this.cliente.usuario.dataNascimento);
      },
      error: (error) => {
        console.log('Erro na requisição', error);
      },
    });
  }

  private loadUsuario(profile: any) {
    this.usuarioService.findByUsername(profile).subscribe({
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

  private criarFormulario() {
    this.formInfoPessoais = this.formBuilder.group({
      
      nome: [
        this.cliente?.usuario.nome || this.keycloakProfile?.firstName || '',
        Validators.required,
      ],

      email: [{ value: this.cliente?.usuario.email || '', disabled: true }], // campo desabilitado

      telefone: this.formBuilder.group({
        codigoArea: [
          this.cliente?.usuario.telefone?.codigoArea || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(2),
          ],
        ],
        numero: [
          this.cliente?.usuario.telefone?.numero || '',
          [Validators.required, Validators.pattern(/^\d{8,9}$/)],
        ],
      }),

      cpf: [{ value: this.cliente?.usuario.cpf || '', disabled: true }],
      dataNascimento: [
        {
          value: this.cliente?.usuario.dataNascimento
            ? new Date(this.cliente.usuario.dataNascimento)
            : '',
        },
      ],
    });
  }

  atualizarInfoBasicas() {
    this.formInfoPessoais.markAllAsTouched();
    if (this.formInfoPessoais.valid) {
      const formValue = this.formInfoPessoais.value;

      this.usuarioService.updateInfoBasica(formValue).subscribe({
        next: () => {
          console.log('Usuario atualizado com sucesso');
          this.snackbarService.showSuccess(
            'Informações atualizadas com sucesso'
          );
          this.editandoInfoPessoais = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          console.log('Erro na requisição', error);
          this.snackbarService.showError('Erro ao salvar informaçoes');
          this.editandoInfoPessoais = false;
        },
      });
    }
  }

  editarEndereco(endereco: Endereco) {
    console.log("id do endereco: " + endereco.id);
    
    this.matDialog
      .open(EnderecoFormModalComponent, {
        width: 'auto',
        data: endereco,
      })
      .afterClosed()
      .subscribe((resultado) => {
        this.enderecoService.update(resultado).subscribe({
          next: () => {
            console.log('Endereco atualizado com sucesso !');
            this.snackbarService.showSuccess('Endereço atualizado com sucesso');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error: (error) => {
            console.log('Erro ao atualizar o endereço !', error);
            this.snackbarService.showError('Erro ao atualizar o endereço');
          },
        });
      });
  }
}
