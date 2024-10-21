import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card'; 

@Component({
  selector: 'app-assistance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './assistance.component.html',
  styleUrl: './assistance.component.scss'
})
export class AssistanceComponent {

  submitted = false;

  assistanceForm: FormGroup = this.fb.group({
    date_assistance: [null, Validators.required],
    customer: [null, Validators.required],
    counter: [null, Validators.required],
    type: [null, Validators.required],
    inverters: this.fb.array([]),
    batteries: this.fb.array([]),
    comment: [null, Validators.required]
  });

  constructor(private fb: FormBuilder) {
    
   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  get inverters(): FormArray {
    return this.assistanceForm.get('inverters') as FormArray;
  }

  get batteries(): FormArray {
    return this.assistanceForm.get('batteries') as FormArray;
  }

  addInverter() {
    let inverter = this.fb.group({
      model: [null, Validators.required],
      serialNumber: [null, Validators.required],
      firmware: [null, Validators.required]
    })
    this.inverters.push(inverter);
  }

  addBattery() {
    let battery = this.fb.group({
      model: [null, Validators.required],
      serialNumber: [null, Validators.required],
      firmware: [null, Validators.required]
    })
    this.batteries.push(battery);
  }

  removeInverter(index: number) {

  }

  save() {
    this.submitted = true;
    if(this.assistanceForm.valid) {
      // SALVA IL FORM
    }
  }

}
