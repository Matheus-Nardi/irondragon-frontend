import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Processador } from '../../../../models/processador/processador.model';
import { ProcessadorService } from '../../../../services/processador.service';
import { ProcessadorCardListComponent } from '../../../processador-card-list/processador-card-list.component';
import { IntelAmdComponent } from './intel-amd/intel-amd.component';
import { SliderImageComponent } from './slider-image/slider-image.component';
import { FaqComponent } from '../faq/faq.component';

@Component({
  selector: 'app-cliente-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    IntelAmdComponent,
    ProcessadorCardListComponent,
    SliderImageComponent,
    FaqComponent,
  ],
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.css',
})
export class ClienteHomeComponent {
  processadores: Processador[] = [];
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  constructor(private processadorService: ProcessadorService) {}

  ngOnInit(): void {
    this.loadProcessadores();
  }

  loadProcessadores() {
    this.processadorService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => {
        console.log(data);
        this.processadores = data.results;
        this.totalRecords = data.count;
      });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProcessadores();
  }
}
