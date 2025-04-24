import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { navbarDataCLiente } from './nav-data-cliente';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-cliente-sidenav',
  imports: [ RouterLink,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    RouterOutlet,
    MatInputModule,
    MatGridListModule],
  templateUrl: './cliente-sidenav.component.html',
  styleUrl: './cliente-sidenav.component.css'
})
export class ClienteSidenavComponent {
  navData = navbarDataCLiente


  @ViewChild('drawer') public drawer!: MatDrawer;
  
    constructor(private sidebarService: SidebarService) {}
  
    ngOnInit(): void {
      this.sidebarService.sideNavToggleSubject.subscribe(() => {
        this.drawer?.toggle();
      });
    }
  
}
