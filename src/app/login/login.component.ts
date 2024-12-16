import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InViewportDirective } from '../directives/in-viewport.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InViewportDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  invalidCredentials = false;
  submitted = false;
  toggled: boolean = true;
  type: string = 'password'

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(private router: Router, private authService: AuthService) { }

  onSwitchChange(): void {
    const isChecked = this.loginForm.get('rememberMe')?.value;
  }

  async login() {
    this.submitted = true;
  
    if (this.loginForm.valid) {
      try {
        // Chiama loginServer e attendi la risposta
        await this.authService.loginServer(
          this.loginForm.get('email')?.value!,
          this.loginForm.get('password')?.value!,
          true
        );
  
        // Verifica se il login è riuscito
        if (!this.authService.invalidCredentials) {
          this.router.navigate(['/newTicket']);
        } else {
          this.invalidCredentials = true; // Mostra messaggio di errore
        }
      } catch (error) {
        console.error('Errore durante il login:', error);
        this.invalidCredentials = true; // Gestione errore server
      }
    }
  }

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
