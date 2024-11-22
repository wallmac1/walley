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
  selector: 'app-popup-system',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule
  ],
  templateUrl: './popup-system.component.html',
  styleUrl: './popup-system.component.scss'
})
export class PopupSystemComponent {

  //comment = new FormControl<string | null>(null);
  submitted = false;
  //product_systemweco: number | null = 3;
  idsystem: number | null = null;

  systemInfo: Load | null = null;

  statusForm = new FormGroup({
    customer_modification: new FormControl<boolean>(false),
    modification_text: new FormControl<string | null>(null),
    system_complete: new FormControl<boolean>(false),
  })

  constructor(public dialogRef: MatDialogRef<PopupSystemComponent>,
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
    //this.product_systemweco = this.data.product_systemweco;
    this.statusForm.get('modification_text')?.disable();
  }

  formLogic() {
    this.statusForm.get('customer_modification')?.valueChanges.subscribe((checked: boolean | null) => {
      if (checked == true) {
        this.statusForm.get('modification_text')?.enable();
        this.statusForm.get('modification_text')?.setValidators(Validators.required);
        if(this.statusForm.get('system_complete')?.value == true) {
          this.statusForm.get('system_complete')?.setValue(false);
        }
      }
      else {
        this.statusForm.get('modification_text')?.setValue(null);
        this.statusForm.get('modification_text')?.setValidators(null);
        this.statusForm.get('modification_text')?.disable();
      }

      this.statusForm.get('modification_text')?.updateValueAndValidity();
    });

    this.statusForm.get('system_complete')?.valueChanges.subscribe((checked: boolean | null) => {
      if (checked == true && this.statusForm.get('customer_modification')?.value == true) {
        this.statusForm.get('customer_modification')?.setValue(false);
      }
    });

    
  }

  convertValues() {
    const booleanResults = this.statusForm.getRawValue();
    let results = {
      customer_modification: 0,
      modification_text: booleanResults.modification_text,
      system_complete: 0,
    }
    if (booleanResults.customer_modification == true) {
      results.customer_modification = 1;
    }
    if (booleanResults.system_complete == true) {
      results.system_complete = 1;
    }

    return results
  }

  // Chiude il dialogo e restituisce "Conferma"
  onConfirm(): void {
    this.submitted = true;
    if (this.statusForm.valid) {
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
