import { Component } from '@angular/core';
import { SidenavComponent } from "../../sidenav/sidenav.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import {MatGridListModule} from '@angular/material/grid-list';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";

@Component({
  selector: 'app-admin-template',
  imports: [SidenavComponent, FooterComponent, MatGridListModule, HeaderAdminComponent],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {

}
