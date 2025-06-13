import { NgClass, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';


export interface SnackbarAction {
  label: string;
  action: () => void;
}

export interface SnackbarData {
  message: string;
  type: 'success' | 'error' ;
  icon: string;
  action?: SnackbarAction;
  duration?: number;
}
@Component({
  selector: 'app-snackbar',
  imports: [MatIconModule, NgClass],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  message: string;
  type: 'success' | 'error' ;
  icon: string;
  action?: SnackbarAction;
  
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: SnackbarData,
      private snackBarRef: MatSnackBarRef<SnackbarComponent>
  ) {
    this.message = data.message;
    this.type = data.type;
    this.icon = data.icon;
    this.action = data.action;
  }

  onAction() {
    if (this.action?.action) {
      this.action.action();
      this.snackBarRef.dismiss();
    }
  }
}
