import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class UserOnlyGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  canActivate(): boolean {
    const roles = this.keycloak.getUserRoles();
    if (!roles.includes('Admin') && !roles.includes('Super')) {
      return true;
    }
    // Redireciona admin para área administrativa
    this.router.navigate(['/admin']);
    return false;
  }
}
