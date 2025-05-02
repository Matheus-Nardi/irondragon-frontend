import { Component, OnInit, signal } from '@angular/core';
import { Processador } from '../../models/processador/processador.model';
import { ProcessadorService } from '../../services/processador.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
type Card = {
  title: string;
  fabricante: string;
  preco: number;
  imageUrl: string;
  specs: {
    nucleos: number;
    threads: number;
  }
}
@Component({
  selector: 'app-processador-card-list',
  imports: [MatCardModule, RouterOutlet, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './processador-card-list.component.html',
  styleUrl: './processador-card-list.component.css'
})
export class ProcessadorCardListComponent implements OnInit {

  page = 0;
  pageSize = 10;
  totalRecords = 0;
  processadores: Processador[] = [];
  cards = signal<Card[]>([]);


  constructor(private processadorService: ProcessadorService) {
    
    
  }
  ngOnInit(): void {
    this.loadProcessadores();
  }

  loadProcessadores(){
    this.processadorService.findAll(this.page,this.pageSize).subscribe(data => {
      this.totalRecords = data.count;
      this.processadores = data.results;
      this.loadCards();
    })
  }

  loadCards(){
    const cards: Card[] = [];
    this.processadores.forEach(processador => {
      cards.push({
        title: processador.nome,
        fabricante: processador.fabricante.nome,
        preco: processador.preco,
        imageUrl: this.processadorService.getUrlImage(processador.id.toString(),processador.imagens[0]),
        specs: {
          nucleos: processador.nucleos,
          threads: processador.threads
        }
      });
    });

    this.cards.set(cards);
  }


    paginar(event: PageEvent): void {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadProcessadores();
    }

}
