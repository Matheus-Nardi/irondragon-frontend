import { Component, signal } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { faqContent } from './faq';

@Component({
  selector: 'app-faq',
  imports: [MatExpansionModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqAccordion = faqContent;
}
