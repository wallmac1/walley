import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-company-data-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './company-data-popup.component.html',
  styleUrl: './company-data-popup.component.scss'
})
export class CompanyDataPopupComponent {

  isSmallScreen: boolean = false;
  idPopup: number = 0;
  submitted: boolean = false;
  regimeList: { id: number, name: string }[] = [];
  provinceList: { id: number, name: string }[] = [];

  companyInfoForm = new FormGroup({
    naturalPerson: new FormControl<number>(0),
    name: new FormControl<string | null>(null),
    surname: new FormControl<string | null>(null),
    business_name: new FormControl<string | null>(null),
    refidcompany: new FormControl<number>(0),
    tax_regime: new FormControl<number | null>(null),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    pec: new FormControl<string | null>(null),
  });

  companyProfessionalBoardForm = new FormGroup({
    board_name: new FormControl<string | null>(null),
    board_number: new FormControl<string | null>(null),
    subscription_date: new FormControl<string | null>(null),
    province: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<CompanyDataPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.idPopup = data.idPopup;
    if (this.idPopup == 1) {
      this.regimeList = data.regimeList;
      this.companyInfoForm.patchValue(data.companyInfo);
    }
    else {
      this.provinceList = data.provinceList;
      this.companyProfessionalBoardForm.patchValue(data.companyProfessionalBoard);
    }
  }

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  historicize() {
    // CHIAMATA AL SERVER PER STORICIZZARE
    this.returnValues();
  }

  update() {
    // CHIAMATA AL SERVER PER AGGIORNARE
    this.returnValues();
  }

  returnValues() {
    if (this.idPopup == 1) {
      this.dialogRef.close({idPopup: 1, companyInfo: this.companyInfoForm.getRawValue()});
    }
    else {
      this.dialogRef.close({idPopup: 2, companyProfessionalBoard: this.companyProfessionalBoardForm.getRawValue()});
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  updateWindowDimensions() {
    if (window.innerWidth < 767) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

}
