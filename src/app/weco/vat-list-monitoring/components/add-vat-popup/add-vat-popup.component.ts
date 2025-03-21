import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Connect } from '../../../../classes/connect';
import { ApiResponse } from '../../../interfaces/api-response';

@Component({
  selector: 'app-add-vat-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-vat-popup.component.html',
  styleUrl: './add-vat-popup.component.scss'
})
export class AddVatPopupComponent {

  submitted: boolean = false;

  newIdentifierForm = new FormGroup({
    identifier: new FormControl<string | null>(null, Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<AddVatPopupComponent>,
    private connectServerService: ConnectServerService) { }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    // Chiamata al server con il valore del form
    const identifier = this.newIdentifierForm.get('identifier')?.value;
    let id = 0;
    this.submitted = true;
    if (this.newIdentifierForm.valid) {
      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'settings/addMonitoringIdentifier', { identifier: identifier })
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            id = val.data.id_identifier;
            this.dialogRef.close({ id: id, identifier: identifier });
          }
        })
    }
  }

}
