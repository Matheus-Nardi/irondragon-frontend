import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { homeData } from './homeData';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [MatCardModule, MatGridListModule, MatIconModule, RouterLink],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  homeDataContent  = homeData;
}
