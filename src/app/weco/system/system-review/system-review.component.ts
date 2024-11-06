import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { SystemInfoFull } from '../../interfaces/system-info-full';
import { Connect } from '../../../classes/connect';
import { StepStatus } from '../../interfaces/step-status';
import { ActivatedRoute } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { InverterData } from '../../interfaces/inverterData';
import { ClusterData } from '../../interfaces/clusterData';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupDialogComponent } from './popup-dialog/popup-dialog.component';
import { StatusHistoryComponent } from "./status-history/status-history.component";
import { StepFourReadonlyComponent } from '../step-four-readonly/step-four-readonly.component';
import { StepFiveReadonlyComponent } from '../step-five-readonly/step-five-readonly.component';
import { StepSixReadonlyComponent } from '../step-six-readonly/step-six-readonly.component';
import { StepOne } from '../../interfaces/step-one';
import { StepTwo } from '../../interfaces/step-two';
import { StepThree } from '../../interfaces/step-three';
import { StepFour } from '../../interfaces/step-four';
import { Image } from '../../interfaces/image';
import { Country } from '../../interfaces/country';
import { ApiResponse } from '../../interfaces/api-response';
import { StepFive } from '../../interfaces/step-five';
import { StepSix } from '../../interfaces/step-six';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { StepOneReadonlyComponent } from '../step-one-readonly/step-one-readonly.component';
import { StepTwoReadonlyComponent } from '../step-two-readonly/step-two-readonly.component';
import { StepThreeReadonlyComponent } from '../step-three-readonly/step-three-readonly.component';
import { PopupWarrantyComponent } from './popup-warranty/popup-warranty.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-system-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatTooltipModule,
    StepOneReadonlyComponent,
    StepTwoReadonlyComponent,
    StepThreeReadonlyComponent,
    StepFourReadonlyComponent,
    StepFiveReadonlyComponent,
    StepSixReadonlyComponent,
    StatusHistoryComponent,
    TranslateModule,
    MatTableModule
],
  templateUrl: './system-review.component.html',
  styleUrl: './system-review.component.scss'
})
export class SystemReviewComponent {
  readonly dialog = inject(MatDialog);

  @ViewChild('stepOne') obj_stepOne!: StepOneReadonlyComponent;
  @ViewChild('stepTwo') obj_stepTwo!: StepTwoReadonlyComponent;
  @ViewChild('stepThree') obj_stepThree!: StepThreeReadonlyComponent;
  @ViewChild('stepFour') obj_stepFour!: StepFourReadonlyComponent;
  @ViewChild('stepFive') obj_stepFive!: StepFiveReadonlyComponent;
  @ViewChild('stepSix') obj_stepSix!: StepSixReadonlyComponent;

  modalImageUrl: string = '';
  displayedColumns: string[] = ['date', 'status', 'message'];

  // TODO: MODIFICARE SYSTEM STATUS CON QUELLO REALE
  systemStatusList: { id: number, name: string, color: string, message: string | null,
    message_date: string | null }[] = [];
  idsystem: number = 0;
  systemInfo: SystemInfoFull = this.initSystem();
  imagesStep2: Image[] = [];
  imagesStep3: Image[] = [];
  urlServerLaraWecare = Connect.urlServerLaraWecare;
  customerCountry: string = '';
  installerCountry: string = '';
  countriesList: Country[] = [];

  stepStatusList: StepStatus[] = [];

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private elementRef: ElementRef) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.systemInfo!.id = this.idsystem;
      this.getSystem();
      //this.stepFourService.setSystemsValues();
    }
  }

  getSystem() {
    this.getStepStatus();
    this.getCountries();
    this.getStepOne();
    this.getStepTwo();
    this.getStepThree();
    this.getStepFour();
    this.getStepFive();
    this.getStepSix();
    this.getStatus();
  }

  getStepOne() {
    this.connectServerService.getRequest<ApiResponse<{ stepOne: StepOne }>>(Connect.urlServerLaraWecare,
      'systems/infoStepOne', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepOne: StepOne }>) => {
        if (val.data && val.data.stepOne) {
          this.systemInfo!.stepOne = val.data.stepOne;
        }
      })
  }

  getStepTwo() {
    this.connectServerService.getRequest<ApiResponse<{ stepTwo: StepTwo }>>(Connect.urlServerLaraWecare, 'systems/infoStepTwo', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepTwo: StepTwo }>) => {
        if (val.data && val.data.stepTwo) {
          this.systemInfo!.stepTwo = val.data.stepTwo;
          this.getImages(2);
        }
      })
  }

  getStepThree() {
    this.connectServerService.getRequest<ApiResponse<{ stepThree: StepThree }>>(Connect.urlServerLaraWecare, 'systems/infoStepThree', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepThree: StepThree }>) => {
        if (val.data.stepThree) {
          this.systemInfo!.stepThree = val.data.stepThree;
          this.getImages(3);
        }
      })
  }

  getStepFour() {
    this.connectServerService.getRequest<ApiResponse<{
      stepFour: StepFour,
      stepInverter: InverterData,
      stepCluster: ClusterData
    }>>(Connect.urlServerLaraWecare, 'systems/infoStepFour',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepFour: StepFour,
        stepInverter: InverterData,
        stepCluster: ClusterData
      }>) => {
        if (val.data && val.data.stepFour) {
          const data_step = val.data.stepFour;
          this.systemInfo.stepFour = val.data.stepFour;
        }
      })
  }

  getStepFive() {
    this.connectServerService.getRequest<ApiResponse<{
      stepFive: StepFive,
    }>>(Connect.urlServerLaraWecare, 'systems/infoStepFive',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepFive: StepFive
      }>) => {
        if (val.data && val.data.stepFive) {
          const data_step = val.data.stepFive;
          this.systemInfo.stepFive = val.data.stepFive;
        }
      })
  }

  getStepSix() {
    this.connectServerService.getRequest<ApiResponse<{
      stepSix: StepSix,
    }>>(Connect.urlServerLaraWecare, 'systems/infoStepSix',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepSix: StepSix
      }>) => {
        if (val.data && val.data.stepSix) {
          const data_step = val.data.stepSix;
          this.systemInfo.stepSix = val.data.stepSix;
        }
      })
  }

  getStepStatus() {
    this.connectServerService.getRequest<ApiResponse<{ stepStatusList: StepStatus[] }>>(
      Connect.urlServerLaraWecare, 'systems/listStepSystemStatus', { idsystem: this.idsystem })
      .subscribe((val: ApiResponse<{ stepStatusList: StepStatus[] }>) => {
        if (val.data) {
          this.stepStatusList = val.data.stepStatusList;
        }
      })
  }

  onFormOneReceived(form: FormGroup) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.getStatus();
    });
  }

  getStatus() {
    // console.log("Received 1")
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string, color: string } }>>
        (Connect.urlServerLaraWecare, 'systems/systemStatusList', { idsystem: this.idsystem })
        .subscribe((val: ApiResponse<{ statusList: { id: number, name: string, color: string, message: string | null,
          message_date: string | null }[] }>) => {
          if (val.data) {
            this.systemStatusList = val.data.statusList;
          }
        })
    }
  }

  getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
  }

  getImages(step: number) {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraWecare, 'systems/filesList',
      {
        idsystem: this.idsystem,
        step_position: step
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          if (step == 2) {
            this.imagesStep2 = val.data.listFiles;
          }
          else if (step == 3) {
            this.imagesStep3 = val.data.listFiles;
          }
        }
      })
  }

  @HostListener('click')
  onClick() {
    const modalId = this.elementRef.nativeElement.getAttribute('data-bs-target');
    if (modalId) {
      const modalElement = document.querySelector(modalId);
      if (modalElement) {
        modalElement.classList.add('show');
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
      }
    }
  }

  setImage(img: Image) {
    // this.modalImageUrl = img.src;
    this.modalImageUrl = '';
  }

  onDataReceived() {
    this.getSystem();
  }

  approveStep(step: number) {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: "Approvazione Step",
        color: "#E7F3ED",
        message: "Sei sicuro di voler approvare lo step?",
        textArea: false,
        actionOne: "Conferma",
        actionTwo: "Annulla"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 1) {
        this.setStepStatus(step, null, 15)
      }
    });
  }

  refuseStep(step: number) {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: "Rifiuto Step",
        color: "#EF9A9A",
        message: "Inserisci un commento con le motivazioni del rifiuto ed i dati che dovrebbero essere modificati",
        textArea: true,
        actionOne: "Invia",
        actionTwo: "Annulla"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 1) {
        this.setStepStatus(step, result.content, 10);
      }
    });
  }

  waitingStep(step: number) {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: "Attesa Step",
        color: "#FFF9C4",
        message: "Sei sicuro di voler mettere l'impianto in attesa di una conferma da un tecnico?",
        textArea: false,
        actionOne: "Conferma",
        actionTwo: "Annulla"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 1) {
        this.setStepStatus(step, null, 5);
      }
    });
  }

  setStepStatus(step: number, message: string | null, status: number) {
    this.connectServerService.postRequest<ApiResponse<any>>(Connect.urlServerLaraWecare, 'systems/changeStepStatus', 
      {idsystem: this.idsystem, step: step, message: message, status: status})
      .subscribe((val: ApiResponse<any>) => {
        if(val) {
          this.getSystem();
        }
      })
  }

  setSystemStatus(message: string | null, status: number) {
    this.connectServerService.postRequest<ApiResponse<any>>(Connect.urlServerLaraWecare, 'systems/changeSystemStatus', 
      {idsystem: this.idsystem, message: message, status: status})
      .subscribe((val: ApiResponse<any>) => {
        if(val) {
          this.getSystem();
        }
      })
  }

  approveSystem() {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: "Approva Impianto",
        color: "#E7F3ED",
        message: "Inserisci un commento con le motivazioni dell'approvazione dell'impianto",
        textArea: true,
        actionOne: "Invia",
        actionTwo: "Annulla"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 1) {
        this.setSystemStatus(result.content, 10);
      }
    });
  }

  dontApproveSystem() {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: "Non Approvare Sistema",
        color: "#EF9A9A",
        message: "Inserisci un commento con le motivazioni della non approvazione dell'impianto, questa azione è irreversibile!",
        textArea: true,
        actionOne: "Invia",
        actionTwo: "Annulla"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 1) {
        this.setSystemStatus(result.content, 10);
      }
    });
  }

  requestModification() {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: "Richiedi Modifica",
        color: "#FFF9C4",
        message: "Sei sicuro di voler mettere l'impianto in attesa di una modifica del cliente?",
        textArea: false,
        actionOne: "Conferma",
        actionTwo: "Annulla"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action == 1) {
        this.setSystemStatus(null, 5);
      }
    });
  }

  warrantyExtension() {
    const dialogRef = this.dialog.open(PopupWarrantyComponent, {data: {idsystem: this.idsystem, product_systemweco: this.systemInfo.stepFour.product_systemweco}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //CHIAMATA AL SERVER PER SALVARE I DATI
      }
    });
  }

  private initSystem() {
    return {
      id: 0,
      stepOne: {
        system_name: '',
        system_description: '',
        system_owner: 0,
        customer_name: '',
        customer_surname: '',
        customer_country: 0,
        customer_phone: '',
        customer_vat: '',
        customer_licensenumber: '',
        customer_fiscalcode: '',
      },
      stepTwo: {
        idcountry: 0,
        location_address: '',
        location_city: '',
        location_postalcode: '',
      },
      stepThree: {
        idcountry: 0,
        installer_companyname: '',
        installer_address: '',
        vendor_contact: '',
        installer_email: '',
        installer_dateofpurchase: '',
      },
      stepFour: {
        product_systemcomposition: null,
        product_systemweco: null,
        product_installdate: null,
        product_brand: null,
        inverter_hybrid: null,
        inverter_online: null,
        refidwecaresystemvolt: null,
        system_model: null,
        refidwecaresystemtype: null,
        cluster_singlebattery: null,
        cluster_numberdevices: null
      },
      stepFive: {
        inverter_communication: 0,
        inverter_power: 0,
        inverters_list: []
      },
      stepSix: {
        cluster_parallel: 0,
        clusters_list: [],
        inverters_list: [],
        cluster_numberdevices: 0,
        cluster_singlebattery: 0
      }
    };
  }
}
