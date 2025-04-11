import { Component } from '@angular/core';
import { SidenavComponent } from "../../sidenav/sidenav.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-admin-template',
  imports: [SidenavComponent, HeaderComponent, FooterComponent, MatGridListModule],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {

}
