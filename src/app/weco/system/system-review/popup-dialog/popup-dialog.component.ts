import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './popup-dialog.component.html',
  styleUrl: './popup-dialog.component.scss'
})
export class PopupDialogComponent {

  comment = new FormControl<string | null>(null);
  submitted = false;
  results : {action: number, content: string | null} = {
    action: 0,
    content: null,
  }

  constructor(public dialogRef: MatDialogRef<PopupDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
      if(this.data.textArea) {
        this.comment.addValidators(Validators.required);
      }
    }

    // Chiude il dialogo e restituisce "Conferma"
  onConfirm(): void {
    this.submitted = true;
    if(this.comment.valid) {
      this.results = {
        action: 1,
        content: this.comment.value,
      } 
      this.dialogRef.close(this.results);
    }
  }

  // Chiude il dialogo e restituisce "Annulla"
  onCancel(): void {
    this.dialogRef.close(this.results);
  }

}
