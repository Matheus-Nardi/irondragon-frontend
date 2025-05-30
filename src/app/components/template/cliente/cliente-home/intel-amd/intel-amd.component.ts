import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intel-amd',
  imports: [MatIconModule],
  templateUrl: './intel-amd.component.html',
  styleUrl: './intel-amd.component.css'
})
export class IntelAmdComponent {

  constructor(private router: Router) {}
  filtarProdutos(fabricante: string): void {
    this.router.navigate(['/processadores'], {queryParams: {fabricante: fabricante.toLowerCase()}})
  }
}
