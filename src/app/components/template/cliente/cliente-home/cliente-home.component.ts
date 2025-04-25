import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Processador } from '../../../../models/processador/processador.model';
import { ProcessadorService } from '../../../../services/processador.service';

@Component({
  selector: 'app-cliente-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ClienteHomeComponent {

  processadores: Processador[] = [];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  imagensSlider = [
    'https://images.unsplash.com/photo-1629480613113-1ce05feadd48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']; 


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
