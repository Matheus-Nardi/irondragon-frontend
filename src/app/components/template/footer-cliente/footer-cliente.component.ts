import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-cliente',
  imports: [MatToolbarModule, MatIconModule, RouterLink],
  templateUrl: './footer-cliente.component.html',
  styleUrl: './footer-cliente.component.css'
})
export class FooterClienteComponent {
currentYear: number = new Date().getFullYear()
}
