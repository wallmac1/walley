import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { StepTwo } from '../../interfaces/step-two';
import { Country } from '../../interfaces/country';
import { Image } from '../../interfaces/image';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../interfaces/api-response';
import { ImageLoaderService } from '../../services/image-loader.service';

@Component({
  selector: 'app-step-two-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './step-two-readonly.component.html',
  styleUrl: './step-two-readonly.component.scss'
})
export class StepTwoReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepTwo: StepTwo | null = null;
  @Input() idsystem = 0;
  @Input() countriesList: Country[] = [];

  stepTwoForm = this.fb.group({
    idcountry: [0, Validators.required],
    location_address: ['', Validators.required],
    location_city: ['', Validators.required],
    location_postalcode: ['', Validators.required]
  })

  isEditable: boolean = false;
  country_name: string = '';
  imagesStep: Image[] = [];
  urlServerLaraApi = Connect.urlServerLaraApi;
  modalImageUrl: string = '';

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private imageLoaderService: ImageLoaderService) { }

  ngOnInit(): void {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
    // this.connectServerService.getRequestCountry().subscribe((val: Country[]) => {
    //   this.countriesList = val;
    //   const result = this.countriesList.find((country: Country) => country.id === this.stepTwo?.idcountry!);
    //   if(result) {
    //     this.country_name = result.common_name;
    //   }
    // })
    this.getImages();
    if (this.isEditable) {
      this.stepTwoForm.patchValue(this.stepTwo!);
    }
    const result = this.countriesList.find((country: Country) => country.id === this.stepTwo?.idcountry!);
    if (result) {
      this.country_name = result.common_name;
    }
  }

  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraWecare, 'systems/filesList',
      {
        idsystem: this.idsystem,
        step_position: 2
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesStep = val.data.listFiles.map(image => {
            // Chiama ImageLoaderService solo una volta per immagine
            this.imageLoaderService.getImageWithToken(Connect.urlServerLaraFileWecare + image.src).subscribe(
              (safeUrl) => {
                image.src = safeUrl; // Assegna l'URL sicuro all'immagine
              }
            );
            return image;
          });
        }
      })
  }

  setImage(img: Image) {
    // this.modalImageUrl = img.src;
    this.modalImageUrl = '';
  }

}
