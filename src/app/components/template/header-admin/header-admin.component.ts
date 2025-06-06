import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { CarrinhoService } from '../../../services/carrinho.service';
import { KeycloakOperationService } from '../../../services/keycloak.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-header-admin',
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
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent {
isAuthenticated = false;
  userProfile?: KeycloakProfile;
    roles: string[] = [];
  
  constructor(
    private sidebarService: SidebarService,
    private keycloakService: KeycloakOperationService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  isAdminOrSuperUser(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Super');
  }

  async loadUserInfo() {
    this.isAuthenticated = this.keycloakService.isLoggedIn();
    this.roles = this.keycloakService.getUserRoles();

    if (this.isAuthenticated) {
      this.userProfile = await this.keycloakService.getUserProfile();
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
    return this.userProfile?.firstName || 'Usuário';
  }

  getEmail(): string {
    return this.userProfile?.email || '';
  }
}
