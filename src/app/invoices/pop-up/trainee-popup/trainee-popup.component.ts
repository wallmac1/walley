import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Trainee } from '../../customer/interfaces/trainee';

@Component({
  selector: 'app-trainee-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './trainee-popup.component.html',
  styleUrl: './trainee-popup.component.scss'
})
export class TraineePopupComponent {

  idPopup: number = 0;
  submitted: boolean = false;

  traineeForm = new FormGroup({
    id: new FormControl<number>(0),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    birthday: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null)
  })

  constructor(public dialogRef: MatDialogRef<TraineePopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    if (this.idPopup == 2) {
      this.traineeForm.patchValue(data.traineeInfo);
    }
  }

  addOrUpdate() {
    this.dialogRef.close({type: this.idPopup, trainee: this.traineeForm.getRawValue()});
  }

  close() {
    this.dialogRef.close(null);
  }

}
