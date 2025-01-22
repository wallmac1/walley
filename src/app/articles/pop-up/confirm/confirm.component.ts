import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Connect } from '../../../classes/connect';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

  isBothFalse = false;
  id: number | null = null;

  confirmForm = new FormGroup({
    update: new FormControl<boolean>(false),
    varies: new FormControl<boolean>(false)
  })

  constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.id = data.articleid;
  }

  formLogic(type: number) {
    if(this.isBothFalse == true) {
      this.isBothFalse = false;
    }
    if (type == 1) {
      if (this.confirmForm.get('update')?.value == true) {
        this.confirmForm.get('varies')?.setValue(false);
      }
      else {
        this.confirmForm.get('varies')?.setValue(true);
      }
    }
    else if (type == 2) {
      if (this.confirmForm.get('varies')?.value == true) {
        this.confirmForm.get('update')?.setValue(false);
      }
      else {
        this.confirmForm.get('update')?.setValue(true);
      }
    }
  }

  confirm() {
    let type = 0;
    if (this.confirmForm.get('update')?.value == true && this.confirmForm.get('varies')?.value == false) {
      type = 1;
    }
    else if (this.confirmForm.get('update')?.value == false && this.confirmForm.get('varies')?.value == true) {
      type = 2;
    }
    this.close(type);
  }

  close(type: number | null) {
    if(type != null && type != 0) {
      this.dialogRef.close(type);
    }
    else if(type == 0) {
      this.isBothFalse = true;
    }
    else if(type == null) {
      this.dialogRef.close(null);
    }
  }
}
