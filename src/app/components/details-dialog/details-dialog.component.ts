import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-details-dialog',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.css'
})
export class DetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, properties: Record<string, any>, icon: string }
  ) {}

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
