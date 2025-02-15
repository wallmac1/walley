import { Component, Input } from '@angular/core';
import { CompanyBroker } from '../../../interfaces/company-broker';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../../weco/interfaces/country';
import { MatDialog } from '@angular/material/dialog';
import { CompanyBrokerPopupComponent } from '../../../pop-up/company-broker-popup/company-broker-popup.component';

@Component({
  selector: 'app-company-broker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './company-broker.component.html',
  styleUrl: './company-broker.component.scss'
})
export class CompanyBrokerComponent {

  @Input() companyBroker: CompanyBroker | null = null;
  @Input() countriesList: Country[] = [];
  @Input() typeList: {id: number, name: string}[] = [];

  companyBrokerForm = new FormGroup({
    country: new FormControl<number | null>(null),
    type: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null),
    surname: new FormControl<string | null>(null),
    business_name: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    eori: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null)
  })

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if(this.companyBroker) {
      this.companyBrokerForm.patchValue(this.companyBroker);
    }
    this.initForm();
  }

  initForm() {
    this.companyBrokerForm.disable();
  }

  modifyBrokerPopup() {
      const dialogRef = this.dialog.open(CompanyBrokerPopupComponent, {
        maxWidth: '900px',
        maxHeight: '500px',
        minWidth: '350px',
        width: '94%',
        data: { 
          companyBroker: this.companyBrokerForm.getRawValue(),
          countriesList: this.countriesList,
          typeList: this.typeList
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          // AGGIORNA CON LE MODIFICHE EFFETTUATE
          this.companyBrokerForm.patchValue(result.companyBroker)
        }
      });
    }

}
