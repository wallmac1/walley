import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  todayDate = new Date();

  therapyForm = new FormGroup({
    id: new FormControl<number>(0),
    therapy_date: new FormControl<string>(this.todayDate.toISOString().split('T')[0], Validators.required),
    totalsessions: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
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
    this.submitted = true;
    if (this.therapyForm.valid) {
      // CHIAMATA AL SERVER ASSEGNANDO ANCHE IL NUOVO ID SE TYPE 1
      if (this.idPopup == 1) {
        this.therapyForm.get('id')?.setValue(4);
      }

      // RITORNA I VALORI
      this.dialogRef.close({ type: this.idPopup, therapy: this.therapyForm.getRawValue() });
    }
  }

  therapyDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateValue = control.value as Date;

      // Se il campo è vuoto o non è un oggetto Date
      if (!dateValue || !(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
        return { invalidDate: true };
      }

      // (Opzionale) Controlla che la data non sia futura
      const now = new Date();
      if (dateValue > now) {
        return { futureDate: true };
      }

      // Se tutto ok, nessun errore
      return null;
    };
  }

  close() {
    this.dialogRef.close(null);
  }

}
