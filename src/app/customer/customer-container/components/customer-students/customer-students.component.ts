import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../interfaces/student';
import { StudentPopupComponent } from '../../../pop-up/student-popup/student-popup.component';

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

  studentsForm!: FormGroup;
  studentsList: Student[] = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.studentsForm = this.fb.group({
      students: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.studentsList = [
      {
        id: 1,
        name: "Mario",
        surname: "Rossi",
        fiscalcode: "RSSMRA80A01H501Z",
        birthday: "1980-01-01",
        email: "mario.rossi@example.com",
        phone: "+39 328 1234567"
      },
      {
        id: 2,
        name: "Giulia",
        surname: "Verdi",
        fiscalcode: "VRDGLI90B02L219H",
        birthday: "1990-02-15",
        email: "giulia.verdi@example.com",
        phone: "+39 334 9876543"
      },
      {
        id: 3,
        name: "Marta",
        surname: "Bianchi",
        fiscalcode: "BNCHNC85C10F205T",
        birthday: null,
        email: "bianchi@example.com",
        phone: null
      }
    ];

    if (this.studentsList.length > 0) {
      this.studentsList.forEach((student) => {
        this.addStudent(student);
      })
    }
  }

  get students(): FormArray {
    return this.studentsForm.get('students') as FormArray;
  }

  addStudent(student: Student) {
    this.students.push(this.createStudent(student));
  }

  createStudent(student: Student) {
    console.log(student);
    return this.fb.group({
      id: [{ value: student.id, disabled: true }],
      name: [{ value: student.name, disabled: true }],
      surname: [{ value: student.surname, disabled: true }],
      fiscalcode: [{ value: student.fiscalcode, disabled: true }],
      birthday: [{ value: student.birthday, disabled: true }],
      email: [{ value: student.email, disabled: true }],
      phone: [{ value: student.phone, disabled: true }]
    })
  }


  // addTraineeEmpty() {
  //   this.trainees.push(this.createTraineeEmpty());
  // }

  // createTraineeEmpty() {
  //   return this.fb.group({
  //     id: [{ value: 0, disabled: true }],
  //     name: [{ value: null, disabled: true }],
  //     surname: [{ value: null, disabled: true }],
  //     fiscalcode: [{ value: null, disabled: true }],
  //     birthday: [{ value: null, disabled: true }],
  //     email: [{ value: null, disabled: true }],
  //     phone: [{ value: null, disabled: true }]
  //   })
  // }

  openStudentPopup(type: number, student: Student | null) {
    const dialogRef = this.dialog.open(StudentPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: type,
        studentInfo: student,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.type == 1) {
          this.addStudent(result.student);
        }
        else {
          const index = this.students.controls.findIndex((student) => student.get('id')?.value == result.student.id);
          this.students.at(index).patchValue(result.student);
        }
      }
    });
  }

}
