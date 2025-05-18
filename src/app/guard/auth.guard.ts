import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private keycloak: KeycloakService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const authenticated = await this.keycloak.isLoggedIn();

    if (!authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
      return false;
    }

    
    const requiredRoles: string[] = route.data['roles'];

    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = this.keycloak.getUserRoles(); // default resource access

      // Verifica se o usuário tem pelo menos uma das roles necessárias
      const hasAccess = requiredRoles.some(role => userRoles.includes(role));

      if (!hasAccess) {
        // Redireciona para "Acesso negado" ou homepage
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}
