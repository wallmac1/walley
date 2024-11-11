import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Connect } from '../../../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';

interface Load {
  listInverter: {
    id: number,
    serialnumber: string,
    date_inverter: string,
    warranty_limit: string,
  }[];
  check_warrantyextended: number;
}

@Component({
  selector: 'app-popup-warranty',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule
  ],
  templateUrl: './popup-warranty.component.html',
  styleUrl: './popup-warranty.component.scss'
})
export class PopupWarrantyComponent {

  comment = new FormControl<string | null>(null);
  submitted = false;
  product_systemweco: number | null = 3;
  idsystem: number | null = null;

  systemInfo: Load | null = null;

  warrantyForm = new FormGroup({
    customer_modification: new FormControl<boolean>(false),
    modification_text: new FormControl<string | null>(null),
    extend_warranty: new FormControl<boolean>(false),
    warranty_limit: new FormControl<Date | null>(null),
    extend_text: new FormControl<string | null>(null),
    refuse_warranty: new FormControl<boolean>(false),
    refuse_text: new FormControl<string | null>(null),
  })

  constructor(public dialogRef: MatDialogRef<PopupWarrantyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.initialization();
    this.formLogic();
  }

  initialization() {
    // CHIAMATA AL SERVER PER I DATI
    // this.connectServerService.getRequest(Connect.urlServerLaraWecare, '', {})
    // .subscribe(val => {

    // })
    this.systemInfo = this.loadExample;
    this.idsystem = this.data.idsystem;
    this.product_systemweco = this.data.product_systemweco;
    this.warrantyForm.get('modification_text')?.disable();
    this.warrantyForm.get('extend_text')?.disable();
    this.warrantyForm.get('refuse_text')?.disable();
    if (this.systemInfo?.check_warrantyextended == 2) {
      this.warrantyForm.get('extend_warranty')?.disable();
    }
  }

  formLogic() {
    this.warrantyForm.get('customer_modification')?.valueChanges.subscribe((checked: boolean | null) => {
      if (checked == true) {
        this.warrantyForm.get('modification_text')?.enable();
        this.warrantyForm.get('extend_warranty')?.setValue(false);
        this.warrantyForm.get('extend_text')?.disable();
        this.warrantyForm.get('refuse_warranty')?.setValue(false);
        this.warrantyForm.get('refuse_text')?.disable();
      }
      else {
        this.warrantyForm.get('modification_text')?.setValue(null);
        this.warrantyForm.get('modification_text')?.disable();
      }
    });

    this.warrantyForm.get('extend_warranty')?.valueChanges.subscribe((checked: boolean | null) => {
      if (checked == true) {
        this.warrantyForm.get('customer_modification')?.setValue(null);
        this.warrantyForm.get('modification_text')?.setValue(null);
        this.warrantyForm.get('modification_text')?.disable();
        this.warrantyForm.get('refuse_warranty')?.setValue(false);
        this.warrantyForm.get('refuse_text')?.setValue(null);
        this.warrantyForm.get('refuse_text')?.disable();
        this.warrantyForm.get('extend_text')?.enable();
      }
      else {
        this.warrantyForm.get('extend_text')?.setValue(null);
        this.warrantyForm.get('extend_text')?.disable();
      }
    });

    this.warrantyForm.get('refuse_warranty')?.valueChanges.subscribe((checked: boolean | null) => {
      if (checked == true) {
        this.warrantyForm.get('customer_modification')?.setValue(null);
        this.warrantyForm.get('modification_text')?.setValue(null);
        this.warrantyForm.get('modification_text')?.disable();
        this.warrantyForm.get('extend_warranty')?.setValue(false);
        this.warrantyForm.get('extend_text')?.setValue(null);
        this.warrantyForm.get('extend_text')?.disable();
        this.warrantyForm.get('refuse_text')?.enable();
      }
      else {
        this.warrantyForm.get('refuse_text')?.setValue(null);
        this.warrantyForm.get('refuse_text')?.disable();
      }
    });
  }

  convertValues() {
    let resultsCorrect = true;
    const booleanResults = this.warrantyForm.getRawValue();
    let results = {
      customer_modification: 0,
      modification_text: booleanResults.modification_text,
      extend_warranty: 0,
      extend_text: booleanResults.extend_text,
      warranty_limit: booleanResults.warranty_limit,
      refuse_warranty: 0,
      refuse_text: booleanResults.refuse_text
    }
    if (booleanResults.customer_modification == true) {
      results.customer_modification = 1;
    }
    if (booleanResults.extend_warranty == true) {
      results.extend_warranty = 1;
    }
    if (booleanResults.refuse_warranty == true) {
      results.refuse_warranty = 1;
    }
    if (this.systemInfo?.check_warrantyextended == 2) {
      if (results.extend_warranty == 1) {
        resultsCorrect = false;
      }
    }

    // CONTROLLA VALIDITA' DEL FORM
    if (results.customer_modification == 1 && resultsCorrect) {
      if (results.extend_warranty == 1 || results.refuse_warranty == 1) {
        resultsCorrect = false;
      }
    }
    if (results.extend_warranty == 1 && resultsCorrect) {
      if (results.customer_modification == 1 || results.refuse_warranty == 1) {
        resultsCorrect = false;
      }
    }
    if (results.refuse_warranty == 1 && resultsCorrect) {
      if (results.customer_modification == 1 || results.extend_warranty == 1) {
        resultsCorrect = false;
      }
    }

    if (resultsCorrect) {
      return results
    }
    else {
      return null
    }
  }

  // Chiude il dialogo e restituisce "Conferma"
  onConfirm(): void {
    this.submitted = true;
    if (this.comment.valid) {
      const results = this.convertValues();
      this.dialogRef.close(results);
    }
  }

  // Chiude il dialogo e restituisce "Annulla"
  onCancel(): void {
    this.dialogRef.close(null);
  }

  loadExample: Load = {
    listInverter: [
      {
        id: 1,
        serialnumber: 'SN12345',
        date_inverter: '2023-01-15',
        warranty_limit: '2026-01-15',
      },
      {
        id: 2,
        serialnumber: 'SN67890',
        date_inverter: '2022-07-20',
        warranty_limit: '2025-07-20',
      }
    ],
    check_warrantyextended: 1
  };
}
