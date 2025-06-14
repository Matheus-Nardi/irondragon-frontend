import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ProcessadorCardListComponent } from '../../../processador/processador-card-list/processador-card-list.component';
import { FaqComponent } from '../faq/faq.component';
import { IntelAmdComponent } from './intel-amd/intel-amd.component';
import { SliderImageComponent } from './slider-image/slider-image.component';

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
}
