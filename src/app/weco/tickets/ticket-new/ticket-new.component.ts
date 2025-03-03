import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { InViewportDirective } from '../../../directives/in-viewport.directive';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Connect } from '../../../classes/connect';
import { SystemInfoPopupComponent } from '../../system/system-info-popup/system-info-popup.component';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Image } from '../../interfaces/image';

@Component({
  selector: 'app-ticket-new',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  newTicketForm!: FormGroup;
  idsystem: number = 0;
  idpopup: number = 0;
  systemList: { id: number, title: string }[] = [];
  requestList: { id: number, title: string }[] = [];
  imageSpaceLeft: boolean = true;
  imagesList: Image[] = [];
  maxImages: number = 10;
  fileList: File[] = [];

  constructor( private connectServerService: ConnectServerService, private fb: FormBuilder,
    private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {

      this.route.queryParamMap.subscribe(params => {
         this.idsystem = parseInt(params.get('idsystem') || '0')
       });
    
    this.newTicketForm = this.fb.group({
      public: [false],
      idticket: [{ value: 0, disabled: true }],
      num_date: [{ value: null, disabled: true }],
      idsystem: [this.idsystem],
      request: [null],
      description: [null],
      internal_notes: [null],
      inverterList: this.fb.array([]),
      batteryList: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getSystemInfo();
    this.getSystemsSelect();
    this.getRequestSelect();
  }

  get inverterList(): FormArray {
    return this.newTicketForm.get('inverterList') as FormArray;
  }

  get batteryList(): FormArray {
    return this.newTicketForm.get('batteryList') as FormArray;
  }

  createInverter(inverter: any) {
    return this.fb.group({
      id: [inverter.id],
      sn: [inverter.sn],
      selected_inverter: [inverter.selected],
    })
  }

  createBattery(battery: any) {
    return this.fb.group({
      id: [battery.id],
      sn: [battery.sn],
      selected_battery: [battery.sn],
    })
  }

  createInverterList(inverterList: any[]) {
    this.inverterList.reset();
    inverterList.forEach((inverter) => {
      this.inverterList.push(this.createInverter(inverter));
    })
  }

  createBatteryList(batteryList: any[]) {
    this.batteryList.reset();
    batteryList.forEach((battery) => {
      this.batteryList.push(this.createBattery(battery));
    })
  }

  getSystemsSelect() {

  }

  getRequestSelect() {

  }

  getSystemInfo() {
    const sampleInverters = [
      { id: 1, sn: 'INV-001', selected: 1 },
      { id: 2, sn: 'INV-002', selected: 0 },
      { id: 3, sn: 'INV-003', selected: 0 },
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

  systemInfoPopup() {
    //console.log("IDSYSTEM", this.idsystem)
    const dialogRef = this.dialog.open(SystemInfoPopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '90%',
      data: { idsystem: this.idsystem }
    });
  }

  /**
* Quando si seleziona i file
* @param event
*/
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.fileList = Array.from(input.files);
      this.uploadFilesServer();
    }
  }
  /**
   * Reset la selezione dei file quando importato
   */
  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload2') as HTMLInputElement;
    fileInput.value = '';
    this.fileList = [];
  }

  private uploadFilesServer() {
    // this.imagesStep2 = this.uploadImageService.getImagesStep2();
    const formData = new FormData();
    formData.append("folder", Connect.FOLDER_STEP_TWO);
    formData.append("size", Connect.FILE_SIZE.toString());
    formData.append("size_string", Connect.FILE_SIZE_STRING);
    //formData.append("idsystem", this.idsystem.toString());
    formData.append("step_position", "2");
    if (this.fileList && this.fileList.length + this.imagesList.length <= this.maxImages) {
      this.fileList.forEach((file, index) => {
        formData.append(`files[]`, file);
      });
      //this.setImages(formData);
      this.imageSpaceLeft = true;
    }
    else {
      this.imageSpaceLeft = false;
    }
  }

  create() { 
    // CHIAMATA AL SERVER E POI SI NAVIGA ALLA PAGINA CON L'ID DEL TICKET RESTITUITO
    const idticket = 0;
    this.router.navigate(['ticket', idticket])
  }

}
