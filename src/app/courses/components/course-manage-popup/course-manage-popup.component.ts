import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-course-manage-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './course-manage-popup.component.html',
  styleUrl: './course-manage-popup.component.scss'
})
export class CourseManagePopupComponent {

  submitted: boolean = false;
  isSmall: boolean = false;
  popupType: number = 0;

  courseForm = new FormGroup({
    idcourse: new FormControl<number>(0),
    name: new FormControl<string | null>(null, Validators.required),
    note: new FormControl<string | null>(null, Validators.required),
    color: new FormControl<string | null>("#ff0000", [Validators.required, this.colorValidator]),
    active: new FormControl<number | boolean>(1),
    obsolete_date: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<CourseManagePopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data.course) {
        this.courseForm.patchValue(data.course);
      }
  }

  ngOnInit(): void {}

  setColor(event: any) {
    this.courseForm.get('color')?.setValue(event.target.value);
  }

  colorValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hexColorRegex = /^#([0-9a-fA-F]{6})$/;
  
    if (!value) return { invalidColor: true };
    return hexColorRegex.test(value) ? null : { invalidColor: true };
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.submitted = true;

    if (this.courseForm.valid) {
      // CHIAMATA AL SERVER PER IL SALVATAGGIO ED AGGIUNTA DELL'ID RESTITUITO
      const action = this.courseForm.get('idcourse')?.value! > 0 ? 'modify' : 'add';
      // IMPOSTA L'ID AL VALORE RICEVUTO DAL SERVER SE EVENTO ERA NUOVO
      //this.courseForm.get('idcourse')?.setValue(5);
      this.dialogRef.close({ course: this.courseForm.getRawValue(), action: action });
    }
  }

}
