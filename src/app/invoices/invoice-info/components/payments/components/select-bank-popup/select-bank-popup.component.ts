import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-select-bank-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './select-bank-popup.component.html',
  styleUrl: './select-bank-popup.component.scss'
})
export class SelectBankPopupComponent {

  bankList: { id: number, denomination: string, iban: string, abi: {code: string, description: string} 
    cab: {code: string, description: string}, bic: string }[] = [];

  constructor(public dialogRef: MatDialogRef<SelectBankPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.bankList = data.bankList
  }

  selectedBank(bank: { id: number, denomination: string, iban: string, abi: {code: string, description: string}, 
      cab: {code: string, description: string}, bic: string }) {
    let selectedBank = {
      id: bank.id,
      denomination: bank.denomination,
      iban: bank.iban,
      abi: bank.abi.code,
      cab: bank.cab.code,
      bic: bank.bic
    }
    this.dialogRef.close(selectedBank);
  }

  close() {
    this.dialogRef.close(null);
  }

}
