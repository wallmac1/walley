import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../../environments/environment';
import { InViewportDirective } from '../../directives/in-viewport.directive';

@Component({
  selector: 'app-access-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    RecaptchaV3Module,
    InViewportDirective
  ],
  // providers: [{
  //   provide: RECAPTCHA_V3_SITE_KEY,
  //   useValue: environment.recaptcha.siteKey
  // }],
  templateUrl: './access-page.component.html',
  styleUrl: './access-page.component.scss'
})
export class AccessPageComponent {

  dropdownOpen = false;
  invalidCredentials = false;
  submitted = false;
  toggled: boolean = true;
  type: string = 'password'

  accessForm = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
    recaptcha: new FormControl(null, Validators.required),
  })

  languagesList: { code: string, name: string, sign: string, flag: string }[] = [
    { code: 'I', name: 'IT', sign: 'IT', flag: 'it-flag.png' },
    { code: 'E', name: 'EN', sign: 'EN', flag: 'en-flag.png' },
  ];
  selectedLanguage: { code: string, name: string, sign: string, flag: string } = this.languagesList[0];

  constructor(private router: Router, private authService: AuthService ) { }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLanguage(code: string): void {
    const selected = this.languagesList.find(lang => lang.code === code);
    if (selected) {
      this.selectedLanguage = selected;
      this.dropdownOpen = false; // Chiudi la tendina dopo la selezione
    }
  }

  // async login() {
  //   this.submitted = true;

  //   if (this.accessForm.valid) {

  //     this.recaptchaV3Service.execute('loginAction').subscribe({
  //       next: async (token: string) => {
  //         console.log('reCAPTCHA token:', token);

  //         // Invia la richiesta al backend insieme al token
  //         const formData = {
  //           ...this.accessForm.value,
  //           recaptchaToken: token,
  //         };
  //         console.log('Form data:', formData);

  //         try {
  //           // Chiama loginServer e attendi la risposta
  //           await this.authService.loginServer(
  //             this.accessForm.get('email')?.value!,
  //             this.accessForm.get('password')?.value!,
  //             true
  //           );

  //           // Verifica se il login è riuscito
  //           if (!this.authService.invalidCredentials) {
  //             this.router.navigate(['/newTicket']);
  //           } else {
  //             this.invalidCredentials = true; // Mostra messaggio di errore
  //           }
  //         } catch (error) {
  //           console.error('Errore durante il login:', error);
  //           this.invalidCredentials = true; // Gestione errore server
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Errore reCAPTCHA:', error);
  //       },
  //     });

  //   }
  // }

  seePassword() {
    if (this.type === 'password') {
      this.type = 'text';
      this.toggled = false;
    }
    else {
      this.type = 'password';
      this.toggled = true;
    }
  }

}
