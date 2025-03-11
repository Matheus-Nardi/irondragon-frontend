import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,

  MatDialogTitle, 
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelClick():void{
    console.log("Usuário cancelou a ação");
    this.dialogRef.close(false);
  }

  onConfirmClick():void{
    console.log("Usuário confirmou a ação");
    this.dialogRef.close(true);
  }
}
