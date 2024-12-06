import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../../../tickets/interfaces/customer';
import { CommonModule } from '@angular/common';
import { Status } from '../../../interfaces/status';
import { Filters } from '../../../interfaces/filters';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

  todayDate = new Date();

  statusList: {id: number, title: string}[] = [];

  voucherFilterForm = new FormGroup({
    date_from: new FormControl<Date>(new Date(this.todayDate.getFullYear() - 1)),
    date_to: new FormControl<Date>(this.todayDate),
    customer: new FormControl<Customer | null>(null),
    status: new FormControl<Status | null>(null),
  })

  constructor() {}

  ngOnInit(): void {
    this.getStatusList()
  }

  getStatusList() {
    this.statusList = [
      {id: 1, title: "Fattura da Pagare"},
      {id: 2, title: "Fattura Pagata"}
    ]
  }

  getFilters(): Filters {
    return this.voucherFilterForm.getRawValue();
  }

}
