import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../interfaces/student';
import { StudentPopupComponent } from '../../../pop-up/student-popup/student-popup.component';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Connect } from '../../../../classes/connect';
import { ApiResponse } from '../../../../weco/interfaces/api-response';

@Component({
  selector: 'app-customer-students',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './customer-students.component.html',
  styleUrl: './customer-students.component.scss'
})
export class CustomerStudentsComponent {

  @Input() idregistry: number = 0;
  studentsList: Student[] = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getStudents();
  }

  // customer/deleteStudent {idregistry, idstudent}

  getStudents() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/studentsList', { idregistry: this.idregistry })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.studentsList = val.data.studentsList;
        }
      })

  }

  openStudentPopup(type: number, student: Student | null) {
    const dialogRef = this.dialog.open(StudentPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: type,
        student: student,
        idregistry: this.idregistry
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // Chiamata al server
        this.getStudents();
      }
    });
  }

  deleteStudent(type: number, student: Student) {
    const dialogRef = this.dialog.open(StudentPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: type,
        student: student,
        idregistry: this.idregistry
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // Chiamata al server
        this.getStudents();
      }
    });
  }

}
