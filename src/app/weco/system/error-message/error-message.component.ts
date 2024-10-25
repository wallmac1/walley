import { Component, Input } from '@angular/core';
import { Status } from '../interfaces/step-status';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserState } from '../../../ngrx/user/user.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {

  currentLanguage: string = 'en';
  @Input() error: Status[] = [];

  constructor(private store: Store<{ user: UserState }>) {}

  ngOnInit(): void {
    // console.log('La lingua è cambiata:', this.translateService.currentLang);
    this.store.select(state => state.user.userInfo).subscribe(
      (val) => {
        this.currentLanguage = val?.lang_code ? val?.lang_code : 'en';
      }
    )
  }

}
