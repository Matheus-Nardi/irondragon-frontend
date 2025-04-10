import { NgClass } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { navbarData } from './nav-data';
import { MatListModule } from '@angular/material/list';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    RouterOutlet,
    MatInputModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  navData = navbarData;

  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.sideNavToggleSubject.subscribe(() => {
      this.drawer?.toggle();
    });
  }

}
