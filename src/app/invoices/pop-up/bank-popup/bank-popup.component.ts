import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Bank } from '../../interfaces/bank';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
  filteredBanks$!: Observable<Bank[]>

  bankForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bankName: string },
    public dialogRef: MatDialogRef<BankPopupComponent>) {}

  ngOnInit(): void {
    this.bankForm = new FormGroup({
      denomination: new FormControl<string>(this.data.bankName)
    })
    this.searchBank();
  }

  closeModal() {
    this.dialogRef.close();
  }

  displayBankName(bank?: any): string {
    return bank;
  }

  private searchBank() {
    this.filteredBanks$ = this.bankForm.get('denomination')!.valueChanges.pipe(
      startWith(this.bankForm.get('denomination')?.value || ''),
      filter(value => value!.length > 0),
      debounceTime(300),
      switchMap((value: string) => this.getArticles(value))
    );
  }

  private getArticles(val: string): Observable<Bank[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const banks: Bank[] = [
      {
        id: 6,
        denomination: "Intesa San Paolo",
        iban: "IT05678249820000003252",
        abi: "42845",
        cab: "928745",
        cc: "983403690",
        bic: "983475"
      }
    ];

    // Restituisce la lista come Observable
    return of(banks).pipe(
      map(items => items.filter(banks =>
        banks.denomination?.toLowerCase().includes(val.toLowerCase())
      ))
    );
  }

  save(option: any) {
    this.dialogRef.close(option);
  }

  close() {
    this.dialogRef.close(null);
  }
}
