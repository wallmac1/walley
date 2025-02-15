import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../weco/interfaces/country';
import { CompanyBrokerComponent } from '../../company-registry/components/company-broker/company-broker.component';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-company-broker-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './company-broker-popup.component.html',
  styleUrl: './company-broker-popup.component.scss'
})
export class CompanyBrokerPopupComponent {
  
  isSmallScreen: boolean = false;
  idPopup: number = 0;
  submitted: boolean = false;
  countriesList: Country[] = [];
  typeList: { id: number, name: string }[] = [];

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

  constructor(public dialogRef: MatDialogRef<CompanyBrokerComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.countriesList = data.countriesList;
    this.typeList = data.typeList;
    this.companyBrokerForm.patchValue(data.companyBroker);
  }

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 767) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  historicize() {
    // CHIAMATA AL SERVER PER STORICIZZARE
    
    this.dialogRef.close({ companyBroker: this.companyBrokerForm.getRawValue() });
  }

  update() {
    // CHIAMATA AL SERVER PER AGGIORNARE
    
    this.dialogRef.close({ companyBroker: this.companyBrokerForm.getRawValue() });
  }

  close() {
    this.dialogRef.close(null);
  }
}
