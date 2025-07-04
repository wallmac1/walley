import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-update-code',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './update-code.component.html',
  styleUrl: './update-code.component.scss'
})
export class UpdateCodeComponent {

  idarticle: number = 0;
  submitted: boolean = false;
  notUniqueCode: boolean = false;

  updateForm = new FormGroup({
    code: new FormControl<string | null>(null, Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<UpdateCodeComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.idarticle = data.idarticle;
    this.updateForm.patchValue(data.code);
  }

  resetVariable() {
    if(this.notUniqueCode) {
      this.notUniqueCode = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  update() {
    this.submitted = true;
    if(this.updateForm.valid) {
      // CHIAMATA AL SERVER, SE IL CODICE È UNIVOCO OK, ALTRIMENTI ERRORE
      this.dialogRef.close({code: this.updateForm.get('code')?.value});
    }
  }

}
