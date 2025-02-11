import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConnectServerService } from '../../../services/connect-server.service';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-existing-customer-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './existing-customer-popup.component.html',
  styleUrl: './existing-customer-popup.component.scss'
})
export class ExistingCustomerPopupComponent {

  constructor(public dialogRef: MatDialogRef<ExistingCustomerPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  save() {
    this.dialogRef.close(true);
  }  

  close() {
    this.dialogRef.close(null);
  }  
}
