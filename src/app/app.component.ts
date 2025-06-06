import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'irondragon';

 constructor(
    private keycloak: KeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    const authenticated = await this.keycloak.isLoggedIn();
    if (authenticated) {
      const userRoles = this.keycloak.getUserRoles();
      if (
        (userRoles.includes('Admin') || userRoles.includes('Super')) &&
        !this.router.url.startsWith('/admin')
      ) {
        this.router.navigate(['/admin']);
      }
    }
  }
}
