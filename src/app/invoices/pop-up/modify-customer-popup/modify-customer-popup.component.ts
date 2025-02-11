import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Customer } from '../../../tickets/interfaces/customer';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-modify-customer-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatAutocompleteModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './modify-customer-popup.component.html',
  styleUrl: './modify-customer-popup.component.scss'
})
export class ModifyCustomerPopupComponent {

  submitted: boolean = false;
  customer: Customer | null = null;
  idPopup: number = 0;
  countriesList: Country[] = [];

  customerGeneralForm = new FormGroup({
    naturalPerson: new FormControl<number>(1),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    businessName: new FormControl<string | null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    country: new FormControl<number | null>(null),
    sdi: new FormControl<string | null>(null),
    pec: new FormControl<string | null>(null),
    sameCode: new FormControl<number>(0)
  })

  modifyCustomerForm = new FormGroup({
    denominazione: new FormControl<string | null>(null),
    codicefiscale: new FormControl<string | null>(null),
    cognome: new FormControl<string | null>(null),
    data_nascita: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    nome: new FormControl<string | null>(null),
    piva: new FormControl<string | null>(null),
    telefono: new FormControl<string | null>(null),
    type: new FormControl<number | string | null>(null),
    address: new FormControl<string | null>(null),
    pec: new FormControl<string | null>(null),
    sdi: new FormControl<string | null>(null),
    cap: new FormControl<string | null>(null),
    city: new FormControl<string | null>(null),
    house_number: new FormControl<string | null>(null),
    country: new FormControl<number | null>(null),
    region: new FormControl<string | null>(null)
  })

  constructor(public dialogRef: MatDialogRef<ModifyCustomerPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPopup = data.idPopup;
    if (this.idPopup == 1) {
      this.customer = data.customer;
    }
    else if (this.idPopup == 2) {
      this.customerGeneralForm.patchValue(data.customerGeneralForm);
      this.countriesList = data.countriesList;
    }
    else {
      this.dialogRef.close(null);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    if (this.idPopup == 1) {
      parseInt(this.customer?.type?.toString()!);
      this.modifyCustomerForm.patchValue(this.customer!);
    }
  }

  confirm() {
    this.submitted = true;
    if (this.modifyCustomerForm.valid) {
      this.dialogRef.close(this.modifyCustomerForm.getRawValue());
    }
  }

  save() {
    this.dialogRef.close(this.customerGeneralForm.getRawValue());
  }

  close() {
    this.dialogRef.close(null);
  }
}
