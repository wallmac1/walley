import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Connect } from '../../../classes/connect';
import { SystemInfoPopupComponent } from '../../system/system-info-popup/system-info-popup.component';
import { ConnectServerService } from '../../../services/connect-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Image } from '../../interfaces/image';
import { ApiResponse } from '../../interfaces/api-response';

@Component({
  selector: 'app-ticket-new',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    QuillModule
  ],
  templateUrl: './ticket-new.component.html',
  styleUrl: './ticket-new.component.scss'
})
export class TicketNewComponent {

  submitted: boolean = false;
  newTicketForm!: FormGroup;
  idsystem: number = 0;
  idpopup: number = 0;
  imageSpaceLeft: boolean = true;
  imagesList: Image[] = [];
  maxImages: number = 10;
  fileList: File[] = [];
  maxFiles: number = 3;
  maxFileSize: number = 5 * 1024 * 1024;

  constructor(private connectServerService: ConnectServerService, private fb: FormBuilder,
    private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {

    this.route.queryParamMap.subscribe(params => {
      this.idsystem = parseInt(params.get('idsystem') || '0')
    });

    this.newTicketForm = this.fb.group({
      public: [false],
      idticket: [{ value: 0, disabled: true }],
      idsystem: [{ value: this.idsystem, disabled: true }, Validators.required],
      systemName: [{value: null, disabled: true}],
      description: [null, Validators.required],
      note: [null],
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
      selected: [inverter.selected],
    })
  }

  createBattery(battery: any) {
    return this.fb.group({
      id: [battery.id],
      sn: [battery.sn],
      selected: [battery.selected],
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
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'systems/devicesList', { idsystem: this.idsystem })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.createInverterList(val.data.inverterList);
          this.createBatteryList(val.data.batteriesList);
        }
      })

      this.connectServerService.getRequest(Connect.urlServerLaraApi, 'systems/systemInfo', {idsystem: this.idsystem})
        .subscribe((val: ApiResponse<any>) => {
          if(val.data) {
            this.newTicketForm.get('systemName')?.setValue(val.data.systemInfo.title);
          }
        })
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

  deleteFile(index: number): void {
    this.imagesList.splice(index, 1);
    this.fileList.splice(index, 1);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      // Verifica il numero massimo di file
      if (this.fileList.length + files.length > this.maxFiles) {
        alert(`Puoi caricare al massimo ${this.maxFiles} file.`);
        return;
      }

      files.forEach((file) => {
        // Verifica la dimensione massima del file
        if (file.size > this.maxFileSize) {
          alert(`Il file ${file.name} supera il limite di 5 MB.`);
        } else {
          this.fileList.push(file);

          // Creare un'anteprima dell'immagine
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileExtension = file.name.split('.').pop() || '';
            const image: Image = {
              id: 0, // Puoi aggiornare l'id successivamente se necessario
              ext: fileExtension,
              src: e.target.result,
              title: file.name,
            };
            this.imagesList.push(image);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  convertBooleanToNumber() {
    this.inverterList.controls.forEach(inverter => {
      inverter.get('selected')?.setValue(inverter.get('selected')?.value ? 1 : 0);
    });

    this.batteryList.controls.forEach(battery => {
      battery.get('selected')?.setValue(battery.get('selected')?.value ? 1 : 0);
    });
  }

  create() {
    // CHIAMATA AL SERVER E POI SI NAVIGA ALLA PAGINA CON L'ID DEL TICKET RESTITUITO
    const formData = new FormData();
    this.submitted = true;
    //console.log(this.newTicketForm.getRawValue())
    if (this.newTicketForm.valid) {
      this.newTicketForm.get('public')?.setValue(this.newTicketForm.get('public')?.value ? 1 : 0);
      this.convertBooleanToNumber();
      // Aggiungi i file al formData
      this.fileList.forEach((file, index) => {
        formData.append('attachments[]', file);
      });

      // Aggiungi i valori del form al formData
      Object.keys(this.newTicketForm.controls).forEach(key => {
        const control = this.newTicketForm.get(key);

        if (control instanceof FormArray) {
          // Se il controllo è un FormArray, aggiungi ciascun valore come array JSON
          formData.append(key, JSON.stringify(control.value));
        } else {
          formData.append(key, control?.value);
        }
      });

      // Aggiungi ID del sistema e del ticket
      formData.append('idsystem', this.idsystem.toString());

      this.connectServerService.postRequest(Connect.urlServerLaraApi, 'systems/saveTicket', formData)
        .subscribe((val: ApiResponse<any>) => {
          if (val.data) {
            //this.popupDialogService.alertElement(val);
            this.router.navigate(['ticket', val.data.idticket]);
          }
        })
    }
  }

}
