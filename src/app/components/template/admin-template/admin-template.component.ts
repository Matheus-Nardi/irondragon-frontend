import { Component } from '@angular/core';
import { SidenavComponent } from "../../sidenav/sidenav.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-admin-template',
  imports: [SidenavComponent, HeaderComponent, FooterComponent],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {

}
