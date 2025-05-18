import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class KeycloakOperationService {
  constructor(private readonly keycloak: KeycloakService) {}

  // Verifica se o usuário está autenticado
  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  // Faz logout
  logout(redirectUri?: string): void {
    this.keycloak.logout(redirectUri);
  }

  // Obtém o token de acesso JWT
  async getToken(): Promise<string | undefined> {
    return await this.keycloak.getToken();
  }

  // Obtém o nome de usuário
  getUsername(): string | undefined {
    return this.keycloak.getUsername();
  }

  // Verifica se o usuário possui uma role específica
  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  // Obtém todas as roles do usuário
  getUserRoles(): string[] {
    return this.keycloak.getUserRoles();
  }

  // Carrega o perfil do usuário (nome, email, etc)
  async getUserProfile(): Promise<Keycloak.KeycloakProfile | undefined> {
    return await this.keycloak.loadUserProfile();
  }

  // Atualiza o token JWT, se necessário
  async refreshTokenIfNeeded(): Promise<void> {
    try {
      const valid = await this.keycloak.updateToken(30); // Atualiza o token 30s antes de expirar
      if (valid) {
        console.log('Token atualizado');
      }
    } catch (error) {
      console.error('Erro ao atualizar o token', error);
    }
  }

  // Realiza o login do usuário, redirecionando para a URL passada
  login(redirectUri: string): void {
    this.keycloak.login({
      redirectUri: window.location.origin + redirectUri,
    });
  }

  // Verifica se o usuário tem permissão para acessar uma rota (com base nas roles)
  hasAccessToRoute(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.every((role) => userRoles.includes(role));
  }
}
