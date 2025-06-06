import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  canActivate(): boolean {
    const roles = this.keycloak.getUserRoles();
    if (roles.includes('Admin') || roles.includes('Super')) {
      return true;
    }
  
    this.router.navigate(['/perfil']);
    return false;
  }
}
