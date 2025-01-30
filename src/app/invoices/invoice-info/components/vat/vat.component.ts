import { Constructor } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vat',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './vat.component.html',
  styleUrl: './vat.component.scss'
})
export class VatComponent {

  vatForm!: FormGroup;
  submitted: boolean = false;

  @Input() collectabilityList: {id: number, name: string}[] = []

  constructor(private fb: FormBuilder) {
    this.vatForm = this.fb.group({
      lines: this.fb.array([])
    })
  }

  ngOnInit(): void {}

  get lines(): FormArray {
    return this.vatForm.get('lines') as FormArray
  }

}
