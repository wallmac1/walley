import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TaxRepresentative } from '../../interfaces/tax-representative';

@Component({
  selector: 'app-update-historicize-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './update-historicize-popup.component.html',
  styleUrl: './update-historicize-popup.component.scss'
})
export class UpdateHistoricizePopupComponent {

  taxRepresentativeObj!: TaxRepresentative;

  constructor(public dialogRef: MatDialogRef<UpdateHistoricizePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.taxRepresentativeObj = data.taxRepresentative;
  }

  update() {
    // CHIAMATA AL SERVER PER L'UPDATE
    this.dialogRef.close(true);
   }

  historicize() {
    // CHIAMATA AL SERVER PER LO STORICIZZA
    this.dialogRef.close(true);
  }

  close() { 
    this.dialogRef.close(null);
  }

}
