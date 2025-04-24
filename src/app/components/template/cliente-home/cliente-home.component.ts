import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Processador } from '../../../models/processador/processador.model';
import { ProcessadorService } from '../../../services/processador.service';

@Component({
  selector: 'app-cliente-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.css'
})
export class ClienteHomeComponent {

  processadores: Processador[] = [];
  totalRecords = 0;
  pageSize = 10;
  page = 0;


  constructor(private processadorService: ProcessadorService){}

  ngOnInit(): void {
   this.loadProcessadores();
  }


  loadProcessadores(){
    this.processadorService.findAll(this.page, this.pageSize).subscribe(data =>{
      console.log(data);
      this.processadores = data.results;
      this.totalRecords = data.count;
    })
  }
}
