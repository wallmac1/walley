import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Trainee } from '../../../interfaces/trainee';
import { MatDialog } from '@angular/material/dialog';
import { TraineePopupComponent } from '../../../pop-up/trainee-popup/trainee-popup.component';

@Component({
  selector: 'app-customer-trainees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './customer-trainees.component.html',
  styleUrl: './customer-trainees.component.scss'
})
export class CustomerTraineesComponent {

  traineesForm!: FormGroup;
  traineesList: Trainee[] = [];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.traineesForm = this.fb.group({
      trainees: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getTrainees();
  }

  getTrainees() {
    this.traineesList = [
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

    if (this.traineesList.length > 0) {
      this.traineesList.forEach((trainee) => {
        this.addTrainee(trainee);
      })
    }
  }

  get trainees(): FormArray {
    return this.traineesForm.get('trainees') as FormArray;
  }

  addTrainee(trainee: Trainee) {
    this.trainees.push(this.createTrainee(trainee));
  }

  // addTraineeEmpty() {
  //   this.trainees.push(this.createTraineeEmpty());
  // }

  createTrainee(trainee: Trainee) {
    console.log(trainee);
    return this.fb.group({
      id: [{ value: trainee.id, disabled: true }],
      name: [{ value: trainee.name, disabled: true }],
      surname: [{ value: trainee.surname, disabled: true }],
      fiscalcode: [{ value: trainee.fiscalcode, disabled: true }],
      birthday: [{ value: trainee.birthday, disabled: true }],
      email: [{ value: trainee.email, disabled: true }],
      phone: [{ value: trainee.phone, disabled: true }]
    })
  }

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

  openTraineePopup(type: number, trainee: Trainee | null) {
    const dialogRef = this.dialog.open(TraineePopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: type,
        traineeInfo: trainee,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.type == 1) {
          this.addTrainee(result.trainee);
        }
        else {
          const index = this.trainees.controls.findIndex((trainee) => trainee.get('id')?.value == result.trainee.id);
          this.trainees.at(index).patchValue(result.trainee);
        }
      }
    });
  }

}
