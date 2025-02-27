import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { TranslateModule } from '@ngx-translate/core';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

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
    idregistry: new FormControl<number>(0),
    idtherapy: new FormControl<number>(0),
    therapy_date: new FormControl<string>(this.todayDate.toISOString().split('T')[0], Validators.required),
    totalsessions: new FormControl<string | null>(null, [Validators.required, this.numberValidator()]),
    description: new FormControl<string | null>(null, Validators.required),
  })

  constructor(public dialogRef: MatDialogRef<TherapyPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    this.therapyForm.get('idregistry')?.setValue(data.idregistry);
    if (this.idPopup == 2) {
      this.therapyForm.patchValue(data.therapyInfo);
    }
    else if(this.idPopup == 3) {
      this.therapyForm.patchValue(data.therapyInfo);
    }
  }

  addOrUpdate() {
    this.submitted = true;
    const totalsessions = parseInt(this.therapyForm.get('totalsessions')?.value!);
    if (this.therapyForm.valid) {
      // CHIAMATA AL SERVER ASSEGNANDO ANCHE IL NUOVO ID SE TYPE 1
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/upsertTherapy',
        {
          idregistry: this.therapyForm.get('idregistry')?.value, idtherapy: this.therapyForm.get('idtherapy')?.value,
          therapy_date: this.therapyForm.get('therapy_date')?.value, totalsessions: totalsessions,
          description: this.therapyForm.get('description')?.value
        }).subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            this.dialogRef.close({ type: this.idPopup });
          }
        })
    }
  }

  deleteTherapy() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/deleteTherapy', 
      {idregistry: this.therapyForm.get('idregistry')?.value, idtherapy: this.therapyForm.get('idtherapy')?.value})
      .subscribe(() => {
        this.dialogRef.close({ type: this.idPopup });
      })
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

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Se il campo è vuoto, consideralo valido
      }

      // Controlla se il valore soddisfa i criteri
      const regex = /^\d+$/; // numeri interi positivi senza simboli
      const isValid = regex.test(value);

      return isValid ? null : { invalidNumber: true }; // Restituisci l'errore se non valido
    };
  }

  close() {
    this.dialogRef.close(null);
  }

}
