import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-slider-image',
  imports: [],
  templateUrl: './slider-image.component.html',
  styleUrl: './slider-image.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class SliderImageComponent {

   imagensSlider = [
      'https://images.unsplash.com/photo-1629480613113-1ce05feadd48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']; 
  
}
