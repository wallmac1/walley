import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent {

  modifyForm = new FormGroup({
    quantity: new FormControl<string | null>(null, Validators.required),
    serialnumber: new FormControl<string | null>(null, Validators.required),
    taxablepurchase: new FormControl<string | null>(null),
    vatpurchase: new FormControl<string | null>(null),
    taxablerecommended: new FormControl<string | null>(null),
    vatrecommended: new FormControl<string | null>(null)
  })

  constructor(public dialogRef: MatDialogRef<ModifyComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.modifyForm.patchValue(data.article);
  }

  modifyArticle() {
    // CHIAMATA AL SERVER PER MODIFICARE L'ARTICOLO
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
