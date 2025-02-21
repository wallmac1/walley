import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

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
    id: new FormControl<number>(0),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    birthday: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null)
  })

  constructor(public dialogRef: MatDialogRef<StudentPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    if (this.idPopup == 2) {
      this.studentForm.patchValue(data.student);
    }
  }

  addOrUpdate() {
    this.submitted = true;
    if(this.studentForm.valid) {
      this.dialogRef.close({type: this.idPopup, student: this.studentForm.getRawValue()});
    }
  }

  close() {
    this.dialogRef.close(null);
  }

}
