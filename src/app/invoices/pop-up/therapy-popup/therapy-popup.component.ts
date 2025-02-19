import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-therapy-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './therapy-popup.component.html',
  styleUrl: './therapy-popup.component.scss'
})
export class TherapyPopupComponent {

  submitted: boolean = false;
  idPopup: number = 0;

  therapyForm = new FormGroup({
    id: new FormControl<number>(0),
    therapy_date: new FormControl<Date>(new Date()),
    sessions: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<TherapyPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    if (this.idPopup == 2) {
      this.therapyForm.patchValue(data.therapyInfo);
    }
  }

  addOrUpdate() {
    // CHIAMATA AL SERVER ASSEGNANDO ANCHE IL NUOVO ID SE TYPE 1
    if (this.idPopup == 1) {
      this.therapyForm.get('id')?.setValue(4);
    }

    // RITORNA I VALORI
    this.dialogRef.close({ type: this.idPopup, therapy: this.therapyForm.getRawValue() });
  }

  close() {
    this.dialogRef.close(null);
  }

}
