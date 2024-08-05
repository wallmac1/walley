import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [],
  templateUrl: './success-dialog.component.html',
  styleUrl: './success-dialog.component.scss'
})
export class SuccessDialogComponent {


  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>, public router: Router, @Inject(MAT_DIALOG_DATA) public data: { message: string, button: string }) {}

  onClose(): void {
    this.dialogRef.close();
    this.router.navigate(["login"])
  }
}
