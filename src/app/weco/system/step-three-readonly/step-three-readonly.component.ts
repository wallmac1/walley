import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StepThree } from '../../interfaces/step-three';
import { Country } from '../../interfaces/country';
import { Image } from '../../interfaces/image';
import { Connect } from '../../../classes/connect';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ImageLoaderService } from '../../services/image-loader.service';
import { ApiResponse } from '../../interfaces/api-response';
import { UserState } from '../../../ngrx/user/user.reducer';
//import { Store } from '@ngrx/store';

@Component({
  selector: 'app-step-three-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './step-three-readonly.component.html',
  styleUrl: './step-three-readonly.component.scss'
})
export class StepThreeReadonlyComponent {
  currentLanguage: string = 'en';
  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepThree: StepThree | null = null;
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

    // constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    //   private imageLoaderService: ImageLoaderService, private store: Store<{ user: UserState }>) { }

  ngOnInit(): void {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
    // this.connectServerService.getRequestCountry().subscribe((val: Country[]) => {
    //   this.countriesList = val;
    //   const result = this.countriesList.find((country: Country) => country.id === this.stepThree?.idcountry!);
    //   if(result) {
    //     this.country_name = result.common_name;
    //   }
    // })
    this.getImages();
    if (this.isEditable) {
      this.stepTwoForm.patchValue(this.stepThree!);
    }
    const result = this.countriesList.find((country: Country) => country.id === this.stepThree?.idcountry!);
    if (result) {
      this.country_name = result.common_name;
    }
    // this.store.select(state => state.user.userInfo).subscribe(
    //   (val) => {
    //     this.currentLanguage = val?.lang_code ? val?.lang_code : 'en';
    //   }
    // )
  }


  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraApi, 'system/filesList',
      {
        idsystem: this.idsystem,
        step_position: 3
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesStep = val.data.listFiles.map(image => {
            // Chiama ImageLoaderService solo una volta per immagine
            this.imageLoaderService.getImageWithToken(Connect.urlServerLaraFile + image.src).subscribe(
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
