import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { KeycloakOperationService } from '../../../services/keycloak.service';
import { KeycloakProfile } from 'keycloak-js';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../../services/carrinho.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit{
  isAuthenticated = false;
  keycloakProfile?: KeycloakProfile;
  usuario!: Usuario;
  cartLength: number = 0;
  roles: string[] = [];
  
  constructor(
    private sidebarService: SidebarService,
    private keycloakService: KeycloakOperationService,
    private carrinhoService: CarrinhoService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.keycloakService.getUserProfile().then((profile) => {
      this.keycloakProfile = profile;
      console.log('Keycloak profile:', profile);
      this.roles = this.keycloakService.getUserRoles()
      if (profile?.email) {
        this.loadUsuario(profile);
      }
    });
    this.loadUserInfo();
    this.getCartLength();
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

  isAdminOrSuperUser(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Super');
  }

  async loadUserInfo() {
    this.isAuthenticated = this.keycloakService.isLoggedIn();
    this.roles = this.keycloakService.getUserRoles();

    if (this.isAuthenticated) {
      this.keycloakProfile = await this.keycloakService.getUserProfile();
      this.getCartLength();
    }
  }

  clickMenu() {
    this.sidebarService.toggle();
  }

  login() {
    this.keycloakService.login('/');
  }

  logout() {
    this.keycloakService.logout(window.location.origin);
  }

  getUsername(): string {
    return this.usuario?.nome || 'Usuário';
  }

  getEmail(): string {
    return this.usuario?.email || '';
  }

  getCartLength() {
    this.carrinhoService.obterTempoReal().subscribe((data) => {
      this.cartLength = data.length;
    });
  }
}
