import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Connect } from '../../../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-popup-warranty',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './popup-warranty.component.html',
  styleUrl: './popup-warranty.component.scss'
})
export class PopupWarrantyComponent {
  comment = new FormControl<string | null>(null);
  submitted = false;
  product_systemweco: number | null = 3;
  idsystem: number | null = null;

  warrantyForm = new FormGroup({
    customer_modification: new FormControl<boolean>(false, Validators.required),
    modification_text: new FormControl<string | null>(null),
    extend_battery: new FormControl<boolean>(false, Validators.required),
    date_startbattery: new FormControl<Date | null>(null),
    date_endbattery: new FormControl<Date | null>(null),
    extend_inverter: new FormControl<boolean>(false, Validators.required),
    date_startinverter: new FormControl<Date | null>(null),
    date_endinverter: new FormControl<Date | null>(null),
    dont_extendbattery: new FormControl<boolean>(true, Validators.required),
    dont_extendinverter: new FormControl<boolean>(true, Validators.required),
    warranty_text: new FormControl<string | null>(null)
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
    this.idsystem = this.data.idsystem;
    this.product_systemweco = this.data.product_systemweco;
    this.warrantyForm.get('modification_text')?.disable();
  }

  formLogic() {
    this.warrantyForm.get('customer_modification')?.valueChanges.subscribe((checked: boolean | null) => {
      if (checked == true) {
        this.warrantyForm.get('modification_text')?.enable();
        this.warrantyForm.get('warranty_text')?.disable();
        this.warrantyForm.get('extend_battery')?.setValue(false);
        this.warrantyForm.get('extend_battery')?.disable();
        this.warrantyForm.get('extend_inverter')?.setValue(false);
        this.warrantyForm.get('extend_inverter')?.disable();
        this.warrantyForm.get('dont_extendbattery')?.disable();
        this.warrantyForm.get('dont_extendbattery')?.setValue(false);
        this.warrantyForm.get('dont_extendinverter')?.disable();
        this.warrantyForm.get('dont_extendinverter')?.setValue(false);
      }
      else {
        this.warrantyForm.get('modification_text')?.disable();
        this.warrantyForm.get('warranty_text')?.enable();
        this.warrantyForm.get('extend_battery')?.enable();
        this.warrantyForm.get('extend_inverter')?.enable();
        this.warrantyForm.get('dont_extendbattery')?.enable();
        this.warrantyForm.get('dont_extendinverter')?.enable();
      }
    });

    this.warrantyForm.get('extend_battery')?.valueChanges.subscribe((checked: boolean | null) => {
      if (this.warrantyForm.get('customer_modification')?.value == false) {
        if (checked == true && this.warrantyForm.get('dont_extendbattery')?.value != false) {
          this.warrantyForm.get('dont_extendbattery')?.setValue(false);
        }
        else if (checked == false && this.warrantyForm.get('dont_extendbattery')?.value != true) {
          this.warrantyForm.get('dont_extendbattery')?.setValue(true);
        }
      }
    });

    this.warrantyForm.get('dont_extendbattery')?.valueChanges.subscribe((checked: boolean | null) => {
      if (this.warrantyForm.get('customer_modification')?.value == false) {
        if (checked == true && this.warrantyForm.get('extend_battery')?.value != false) {
          this.warrantyForm.get('extend_battery')?.setValue(false);
        }
        else if (checked == false && this.warrantyForm.get('extend_battery')?.value != true) {
          this.warrantyForm.get('extend_battery')?.setValue(true);
        }
      }
    });

    this.warrantyForm.get('extend_inverter')?.valueChanges.subscribe((checked: boolean | null) => {
      if (this.warrantyForm.get('customer_modification')?.value == false) {
        if (checked == true && this.warrantyForm.get('dont_extendinverter')?.value != false) {
          this.warrantyForm.get('dont_extendinverter')?.setValue(false);
        }
        else if (checked == false && this.warrantyForm.get('dont_extendinverter')?.value != true) {
          this.warrantyForm.get('dont_extendinverter')?.setValue(true);
        }
      }
    });

    this.warrantyForm.get('dont_extendinverter')?.valueChanges.subscribe((checked: boolean | null) => {
      if (this.warrantyForm.get('customer_modification')?.value == false) {
        if (checked == true && this.warrantyForm.get('extend_inverter')?.value != false) {
          this.warrantyForm.get('extend_inverter')?.setValue(false);
        }
        else if (checked == false && this.warrantyForm.get('extend_inverter')?.value != true) {
          this.warrantyForm.get('extend_inverter')?.setValue(true);
        }
      }
    });
  }

  convertValues() {
    const booleanResults = this.warrantyForm.getRawValue();
    let results = {
      customer_modification: 0,
      modification_text: booleanResults.modification_text,
      extend_battery: 0,
      date_startbattery: booleanResults.date_endbattery,
      date_endbattery: booleanResults.date_endbattery,
      extend_inverter: 0,
      date_startinverter: booleanResults.date_startinverter,
      date_endinverter: booleanResults.date_endinverter,
      dont_extendbattery: 0,
      dont_extendinverter: 0,
      warranty_text: booleanResults.warranty_text
    }
    if (booleanResults.customer_modification == true) {
      results.customer_modification = 1;
    }
    if (booleanResults.extend_battery == true) {
      results.extend_battery = 1;
    }
    if (booleanResults.extend_inverter == true) {
      results.extend_inverter = 1;
    }
    if (booleanResults.dont_extendbattery == true) {
      results.dont_extendbattery = 1;
    }
    if (booleanResults.dont_extendinverter == true) {
      results.dont_extendinverter = 1;
    }
    return results
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
}
