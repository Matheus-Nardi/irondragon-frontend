import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';


export interface SnackbarAction {
  label: string;
  action: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  showSuccess(message: string, action?: SnackbarAction): void {
    this.snackbar.openFromComponent(SnackbarComponent,{
      data:{
        message,
        type: 'success',
        icon: 'check_circle',
        action
      },
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-container', 'success']
    })
  }

  showError(message: string): void {  
    this.snackbar.openFromComponent(SnackbarComponent,{
      data:{
        message,
        type: 'error',
        icon: 'error',
      },
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-container', 'error']
    })
  }
}
