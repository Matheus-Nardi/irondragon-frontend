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
  userProfile?: KeycloakProfile;
  cartLength: number = 0;
  
  constructor(
    private sidebarService: SidebarService,
    private keycloakService: KeycloakOperationService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.getCartLength();
  }

  async loadUserInfo() {
    this.isAuthenticated = this.keycloakService.isLoggedIn();

    if (this.isAuthenticated) {
      this.userProfile = await this.keycloakService.getUserProfile();
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
    return this.userProfile?.firstName || 'Usuário';
  }

  getEmail(): string {
    return this.userProfile?.email || '';
  }

  getCartLength() {
    this.carrinhoService.obterTempoReal().subscribe((data) => {
      this.cartLength = data.length;
    });
  }
}
