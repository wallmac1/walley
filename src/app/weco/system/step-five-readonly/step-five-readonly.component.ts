import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { StepFive } from '../../interfaces/step-five';

@Component({
  selector: 'app-step-five-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './step-five-readonly.component.html',
  styleUrl: './step-five-readonly.component.scss'
})
export class StepFiveReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepFive: StepFive | null = null;
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

  ngOnInit(): void {
    // console.log("LISTA INVERTER", this.stepFive?.inverters_list)
  }

}
