import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Customer } from '../../../tickets/interfaces/customer';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
    country: new FormControl<string | null>(null),
    region: new FormControl<string | null>(null)
  })

  constructor(public dialogRef: MatDialogRef<ModifyCustomerPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.customer = data.customer;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    parseInt(this.customer?.type?.toString()!);
    this.modifyCustomerForm.patchValue(this.customer!);
  }

  confirm() {
    this.submitted = true;
    if (this.modifyCustomerForm.valid) {
      this.dialogRef.close(this.modifyCustomerForm.getRawValue());
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
