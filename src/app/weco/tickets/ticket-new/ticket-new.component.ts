import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-ticket-new',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatExpansionModule,
    InViewportDirective,
    ReactiveFormsModule,
    QuillModule
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  newTicketForm!: FormGroup;
  requestList: { id: number, title: string }[] = [];
  isSmallScreen: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.newTicketForm = this.fb.group({
      email: [null],
      request: [null],
      description: [null],
      inverterList: this.fb.array([this.createInverterEmpty()]),
      batteryList: this.fb.array([this.createBatteryEmpty()])
    })
  }

  ngOnInit(): void {
    this.getData();
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

  getData() {
    // CHIAMATA AL SERVER. SE PRESENTI INVERTER O BATTERIE CREA LISTE
    const sampleInverters = [
      { id: 1, sn: 'INV-001', selected: 1 },
      { id: 2, sn: 'INV-002', selected: 0 },
      { id: 3, sn: 'INV-003', selected: 0 }
    ];
    this.createInverterList(sampleInverters);

    const sampleBatteries = [
      { id: 10, sn: 'BAT-001', selected: 1 },
      { id: 11, sn: 'BAT-002', selected: 0 },
      { id: 12, sn: 'BAT-003', selected: 0 }
    ];
    this.createBatteryList(sampleBatteries);
  }

  get inverterList(): FormArray {
    return this.newTicketForm.get('inverterList') as FormArray;
  }

  get batteryList(): FormArray {
    return this.newTicketForm.get('batteryList') as FormArray;
  }

  createInverterEmpty() {
    return this.fb.group({
      id: [0],
      sn: [null],
      selected: [0],
    })
  }

  createBatteryEmpty() {
    return this.fb.group({
      id: [0],
      sn: [null],
      selected: [0],
    })
  }

  createInverter(inverter: any) {
    return this.fb.group({
      id: [inverter.id],
      sn: [inverter.sn],
      selected: [inverter.selected],
    })
  }

  createBattery(battery: any) {
    return this.fb.group({
      id: [battery.id],
      sn: [battery.sn],
      selected: [battery.sn],
    })
  }

  createInverterList(inverterList: any[]) {
    if (this.inverterList.length > 0) {
      this.inverterList.controls.splice(0, 1);
    }
    inverterList.forEach((inverter) => {
      this.inverterList.push(this.createInverter(inverter));
    })
  }

  createBatteryList(batteryList: any[]) {
    if (this.batteryList.length > 0) {
      this.batteryList.controls.splice(0, 1);
    }
    batteryList.forEach((battery) => {
      this.batteryList.push(this.createBattery(battery));
    })
  }

  createTicket() {
    // CHIAMATA AL SERVER E POI NAVIGA CON L'ID RESTITUITO
    const id = 0
    this.router.navigate(['ticketModifyWeco', id])
  }

}
