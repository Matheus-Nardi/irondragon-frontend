import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { DetailsDialogComponent } from '../components/details-dialog/details-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { 

  }

  openConfirmDialog(title: string, message: string, icon: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title, message, icon },
    }).afterClosed();
  }

  openDetailsDialog(title: string, properties: Record<string, any>, icon: string) {
    return this.dialog.open(DetailsDialogComponent, {
      width: '500px',
      data: { title, properties },
    }).afterClosed();
  }
}
