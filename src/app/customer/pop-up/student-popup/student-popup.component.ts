import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-student-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './student-popup.component.html',
  styleUrl: './student-popup.component.scss'
})
export class StudentPopupComponent {

  idPopup: number = 0;
  submitted: boolean = false;

  studentForm = new FormGroup({
    idregistry: new FormControl<number>(0),
    idstudent: new FormControl<number>(0),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    birthday: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, Validators.email),
    phone: new FormControl<string | null>(null)
  })

  constructor(public dialogRef: MatDialogRef<StudentPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    this.studentForm.get('idregistry')?.setValue(data.idregistry);
    if (this.idPopup != 1) {
      this.studentForm.patchValue(data.student);
    }
  }

  addOrUpdate() {
    this.submitted = true;
    if (this.studentForm.valid) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/upsertStudent',
        {
          idregistry: this.studentForm.get('idregistry')?.value, idstudent: this.studentForm.get('idstudent')?.value,
          name: this.studentForm.get('name')?.value, surname: this.studentForm.get('surname')?.value,
          fiscalcode: this.studentForm.get('fiscalcode')?.value, email: this.studentForm.get('email')?.value,
          birthday: this.studentForm.get('birthday')?.value, phone: this.studentForm.get('phone')?.value
        })
        .subscribe((val: ApiResponse<any>) => {
          this.dialogRef.close({ type: this.idPopup });
        })
    }
  }

  deleteStudent() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'customer/deleteStudent',
      { idregistry: this.studentForm.get('idregistry')?.value, idstudent: this.studentForm.get('idstudent')?.value })
      .subscribe(() => {
        this.dialogRef.close({ type: this.idPopup });
      })
  }

  close() {
    this.dialogRef.close(null);
  }

}
