import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentTableComponent } from "./components/payment-table/payment-table.component";
import { MatDialog } from '@angular/material/dialog';
import { PaymentModifyPopupComponent } from './components/payment-modify-popup/payment-modify-popup.component';
import { PaymentConditions } from './interfaces/payment-conditions';

@Component({
  selector: 'app-payment-conditions',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTableModule,
    PaymentTableComponent
  ],
  templateUrl: './payment-conditions.component.html',
  styleUrl: './payment-conditions.component.scss'
})
export class PaymentConditionsComponent {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

  filter() { }

  modifyPopup(event: number) {
    // PRENDI INFO DAL SERVER (EVENT È L'ID DEL METODO DI PAGAMENTO)
    let paymentMethod : PaymentConditions | null = null;

    const dialogRef = this.dialog.open(PaymentModifyPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '700px',
      width: '90%',
      data: { 
        paymentCondition: paymentMethod
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      paymentMethod = result;
      // Aggiungi valore alla tabella del figlio
    });
  }

}
