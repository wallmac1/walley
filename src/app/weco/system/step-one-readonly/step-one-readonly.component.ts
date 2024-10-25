import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StepOne } from '../../interfaces/step-one';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-step-one-readonly',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './step-one-readonly.component.html',
  styleUrl: './step-one-readonly.component.scss'
})
export class StepOneReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepOne: StepOne | null = null;
  @Input() idsystem = 0;
  @Input() countriesList: Country[] = [];

  stepOneForm = this.fb.group({
    system_name: ['', Validators.required],
    system_description: ['', Validators.required],
    system_owner: [0, Validators.required],
    customer_name: ['', Validators.required],
    customer_surname: ['', Validators.required],
    customer_country: [0, Validators.required],
    customer_phone: ['', Validators.required],
    customer_vat: ['', Validators.required],
    customer_licensenumber: ['', Validators.required],
    customer_fiscalcode: ['', Validators.required],
  });

  isEditable: boolean = false;
  country_name: string = '';

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService) {}

  ngOnInit(): void {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGRESSO IN UN FORM
    this.connectServerService.getRequestCountry().subscribe((val: Country[]) => {
      this.countriesList = val;
      const result = this.countriesList.find((country: Country) => country.id === this.stepOne?.customer_country!);
      if(result) {
        this.country_name = result.common_name;
      }
    })
    if(this.isEditable) {
      this.stepOneForm.patchValue(this.stepOne!);
    }
  }

}
