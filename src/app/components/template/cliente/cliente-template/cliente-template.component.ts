import { Component, OnInit } from '@angular/core';
import { Processador } from '../../../../models/processador/processador.model';
import { ProcessadorService } from '../../../../services/processador.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { ClienteSidenavComponent } from '../cliente-sidenav/cliente-sidenav.component';


@Component({
  selector: 'app-cliente-template',
  imports: [HeaderComponent, FooterComponent, ClienteSidenavComponent],
  templateUrl: './cliente-template.component.html',
  styleUrl: './cliente-template.component.css'
})
export class ClienteTemplateComponent {

 
}
