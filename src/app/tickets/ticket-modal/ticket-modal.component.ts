import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel
  ],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss'
})
export class TicketModalComponent {
  editForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<TicketModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Inizializza il form con i dati passati al dialog
    this.editForm.patchValue(data);
  }

  save(): void {
    this.dialogRef.close(this.editForm.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
