import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Bank } from '../../../bank/interfaces/bank';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../weco/interfaces/api-response';
import { Connect } from '../../../classes/connect';

@Component({
  selector: 'app-bank-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  templateUrl: './bank-popup.component.html',
  styleUrl: './bank-popup.component.scss'
})
export class BankPopupComponent {

  submitted = false;
  bankList: Bank[] = [];

  bankForm = new FormGroup({
    bank_obj: new FormControl<Bank | null>(null)
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bank: Bank },
    public dialogRef: MatDialogRef<BankPopupComponent>, private connectServerService: ConnectServerService) {}

  ngOnInit(): void {
    this.getBankList();
  }

  closeModal() {
    this.dialogRef.close();
  }

  private getBankList() {
    // CHIAMATA AL SERVER
    this.connectServerService.getRequest<ApiResponse<{ bank: Bank[] }>>(Connect.urlServerLaraApi, 'bank/activeBanksList',
      {}).subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.bankList = val.data.bankList
        }
      })
  }

  selectBank() {
    this.dialogRef.close({bank: this.bankForm.get('bank_obj')?.value});
  }

  close() {
    this.dialogRef.close(null);
  }
}
