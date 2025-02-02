import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss'
})
export class HeadingComponent {

  submitted: boolean = false;
  todayDate = new Date();
  isSmallScreen: boolean = false;

  @Input() heading: any | null = null;
  @Input() typeList: { id: number, code: string, description: string }[] = [];
  @Input() formatList: { id: number, code: string, description: string }[] = [];
  @Input() currencyList: { id: number, code: string, description: string }[] = [];

  headingForm = new FormGroup({
    type: new FormControl<number | null>(null, Validators.required),
    format: new FormControl<number | null>(null, Validators.required),
    number_part1: new FormControl<number | null>(null, Validators.required),
    number_part2: new FormControl<string | null>(null, this.lengthValidator(6)),
    number_part3: new FormControl<string | null>(null, this.lengthValidator(6)),
    conformity: new FormControl<number | null>(null),
    date: new FormControl<string | null>(this.todayDate.toISOString().split('T')[0], Validators.required),
    administrativeref: new FormControl<string | null>(null),
    currency: new FormControl<number | null>(null, Validators.required),
    reason: new FormControl<string | null>(null)
  });

  constructor() { }

  ngOnInit(): void {
    this.initForm();
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 768) {
      this.isSmallScreen = true;
    }
    else {
      this.isSmallScreen = false;
    }
  }

  lengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      else {
        if (value.length > maxLength) {
          return { invalidNumber: true };
        }
        else {
          return null;
        }
      }
    };
  }

  private initForm() {
    this.headingForm.patchValue(this.heading);
    this.headingForm.get('number_part1')?.setValue(this.heading?.number.part1);
    this.headingForm.get('number_part2')?.setValue(this.heading?.number.part2);
    this.headingForm.get('number_part3')?.setValue(this.heading?.number.part3);
  }

  saveHeading() {
    this.submitted = true;
    if (this.headingForm.valid) {
      // SALVA SUL SERVER
    }
  }

}
