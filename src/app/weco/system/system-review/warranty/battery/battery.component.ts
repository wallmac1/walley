import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { WarrantyBatteryForm, WarrantyInfo, WarrantyInverterForm } from '../../../../interfaces/warranty-info';

@Component({
  selector: 'app-battery',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  templateUrl: './battery.component.html',
  styleUrl: './battery.component.scss'
})
export class BatteryComponent {

  isOpen: boolean = false;
  submitted: boolean = false;

  @Output() confirm = new EventEmitter<WarrantyBatteryForm>();
  @Input() warrantyInfo: WarrantyInfo | null = null;

  warrantyBatteryForm = new FormGroup({
    warrantyBatteryValid: new FormControl<number | null>(null, Validators.required),
    warrantyBatteryValidComment: new FormControl<string | null>(null, Validators.required),
  })

  ngOnInit(): void {
    this.formLogic();
  }

  emitEvent() {
    this.submitted = true;
    if(this.warrantyBatteryForm.valid) {
      this.confirm.emit(this.warrantyBatteryForm.getRawValue());
    }
  }

  formLogic() {
    this.warrantyBatteryForm.get('warrantyBatteryValid')?.setValue(this.warrantyInfo?.warrantyBatteryValid!);
    this.warrantyBatteryForm.get('warrantyBatteryValidComment')?.setValue(this.warrantyInfo?.warrantyBatteryValidComment!);
  }

}
