import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StepFour } from '../../interfaces/step-four';
import { UserState } from '../../../ngrx/user/user.reducer';
// import { UserState } from '../../../../ngrx/user/user.reducer';
// import { Store } from '@ngrx/store';

@Component({
  selector: 'app-step-four-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './step-four-readonly.component.html',
  styleUrl: './step-four-readonly.component.scss'
})
export class StepFourReadonlyComponent implements OnInit{
  currentLanguage: string = 'en';
  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepFour: StepFour | null = null;
  @Input() idsystem = 0;


  // constructor(private store: Store<{ user: UserState }>) {
  //   // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  // }

  ngOnInit(): void {
    // console.log('La lingua è cambiata:', this.translateService.currentLang);
    // this.store.select(state => state.user.userInfo).subscribe(
    //   (val) => {
    //     this.currentLanguage = val?.lang_code ? val?.lang_code : 'en';
    //   }
    // )
  }

}
