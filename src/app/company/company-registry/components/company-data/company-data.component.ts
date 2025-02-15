import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyData } from '../../../interfaces/company-data';
import { Country } from '../../../../invoices/interfaces/country';
import { MatDialog } from '@angular/material/dialog';
import { CompanyDataPopupComponent } from '../../../pop-up/company-data-popup/company-data-popup.component';

@Component({
  selector: 'app-company-data',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './company-data.component.html',
  styleUrl: './company-data.component.scss'
})
export class CompanyDataComponent {

  @Input() companyData: CompanyData | null = null;
  @Input() provinceList: { id: number, name: string }[] = [];
  @Input() regimeList: { id: number, name: string }[] = [];
  @Output() modifyName = new EventEmitter<{companyDataObj: CompanyData}>;

  submitted: boolean = false;

  companyInfoForm = new FormGroup({
    naturalPerson: new FormControl<number>(0),
    name: new FormControl<string | null>(null),
    surname: new FormControl<string | null>(null),
    business_name: new FormControl<string | null>(null),
    refidcompany: new FormControl<number>(0),
    tax_regime: new FormControl<number | null>(null),
    fiscalcode: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null),
    pec: new FormControl<string | null>(null),
    eori: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    fax: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    lender_code: new FormControl<string | null>(null)
  });

  companyProfessionalBoardForm = new FormGroup({
    board_name: new FormControl<string | null>(null),
    board_number: new FormControl<string | null>(null),
    subscription_date: new FormControl<string | null>(null),
    province: new FormControl<string | null>(null),
  })

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.companyData) {
      this.companyInfoForm.patchValue(this.companyData.info);
      this.companyProfessionalBoardForm.patchValue(this.companyData.professional_board);
    }
    this.infoFormLogic();
    this.professionalBoardFormLogic();
  }

  infoFormLogic() {
    this.companyInfoForm.get('tax_regime')?.disable();
    this.companyInfoForm.get('fiscalcode')?.disable();
    this.companyInfoForm.get('vat')?.disable();
    this.companyInfoForm.get('pec')?.disable();
  }

  professionalBoardFormLogic() {
    this.companyProfessionalBoardForm.disable();
  }

  modifyInfoPopup(type: any) {
    const dialogRef = this.dialog.open(CompanyDataPopupComponent, {
      maxWidth: '800px',
      maxHeight: '500px',
      minWidth: '350px',
      width: '94%',
      data: { 
        idPopup: type, 
        companyProfessionalBoard: this.companyProfessionalBoardForm.getRawValue(),
        companyInfo: this.companyInfoForm.getRawValue(),
        regimeList: this.regimeList,
        provinceList: this.provinceList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // AGGIORNA CON LE MODIFICHE EFFETTUATE
        if(result.idPopup == 1) {
          this.companyInfoForm.patchValue(result.companyInfo);
          this.modifyName.emit({companyDataObj: result.companyInfo});
        }
        else {
          this.companyProfessionalBoardForm.patchValue(result.companyProfessionalBoard);
        }
      }
    });
  }

  selectedCountry() { }

  save() { }

}
