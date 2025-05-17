import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { KeycloakOperationService } from '../../services/keycloak.service';
import { UsuarioService } from '../../services/usuario.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { HeaderComponent } from '../template/header/header.component';
import { FooterComponent } from '../template/footer/footer.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { Cliente } from '../../models/cliente.model';
import { KeycloakProfile } from 'keycloak-js';

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
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  keycloakProfile?: Keycloak.KeycloakProfile;
  cliente!: Cliente;
  form!: FormGroup;
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
    private clienteService: ClienteService
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

  loadListaDesejos() {
    this.clienteService.getListaDesejos().subscribe((lista) => {
      this.cliente.listaDeDesejos = lista;
    });
  }
}
