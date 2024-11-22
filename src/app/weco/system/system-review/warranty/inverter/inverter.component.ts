import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { WarrantyInfo, WarrantyInverterForm } from '../../../../interfaces/warranty-info';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-inverter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatExpansionModule
  ],
  templateUrl: './inverter.component.html',
  styleUrl: './inverter.component.scss'
})
export class InverterComponent {

  isOpen: boolean = false;
  submitted: boolean = false;

  @Input() warrantyInfo: WarrantyInfo | null = null;
  @Output() confirm = new EventEmitter<WarrantyInverterForm>();

  warrantyInverterForm = new FormGroup({
    warrantyInverterValid: new FormControl<number | null>(null, Validators.required),
    warrantyInverterExtended: new FormControl<number | null>(null, Validators.required),
    warrantyInverterValidComment: new FormControl<string | null>(null, Validators.required),
    warrantyInverterExtendedComment: new FormControl<string | null>(null, Validators.required),
  })

  ngOnInit(): void {
    this.formLogic();
  }

  emitEvent() {
    this.submitted = true;
    if(this.warrantyInverterForm.valid) {
      this.confirm.emit(this.warrantyInverterForm.getRawValue());
    }
  }

  formLogic() {
    this.warrantyInverterForm.get('warrantyInverterValid')?.setValue(this.warrantyInfo?.warrantyInvertervalid!);
    this.warrantyInverterForm.get('warrantyInverterValidComment')?.setValue(this.warrantyInfo?.warrantyInverterValidComment!);
    this.warrantyInverterForm.get('warrantyInverterExtended')?.setValue(this.warrantyInfo?.warrantyInverterExtended!);
    this.warrantyInverterForm.get('warrantyInverterExtendedComment')?.setValue(this.warrantyInfo?.warrantyInverterExtendedComment!);

    if (this.warrantyInverterForm.get('warrantyInverterValid')?.value != 1) {
      this.warrantyInverterForm.get('warrantyInverterExtended')?.disable();
      this.warrantyInverterForm.get('warrantyInverterExtendedComment')?.disable();
    }

    this.warrantyInverterForm.get('warrantyInverterValid')?.valueChanges.subscribe((value) => {
      if (value == 0) {
        this.warrantyInverterForm.get('warrantyInverterExtended')?.setValue(null);
        this.warrantyInverterForm.get('warrantyInverterExtended')?.disable();
        this.warrantyInverterForm.get('warrantyInverterExtendedComment')?.setValue(null);
        this.warrantyInverterForm.get('warrantyInverterExtendedComment')?.disable();
      }
      else if (value == 1) {
        this.warrantyInverterForm.get('warrantyInverterExtended')?.enable();
        this.warrantyInverterForm.get('warrantyInverterExtendedComment')?.enable();
      }
    });
  }

}
