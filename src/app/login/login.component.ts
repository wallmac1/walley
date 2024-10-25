import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
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
    rememberMe: new FormControl<number>(0, Validators.required)
  })

  constructor(private router: Router, private authService: AuthService) { }

  onSwitchChange(): void {
    const isChecked = this.loginForm.get('rememberMe')?.value;
    this.loginForm.get('rememberMe')?.setValue(isChecked ? 1 : 0);
  }

  async login() {
    // await this.authService.loginUser(
    //   this.loginForm.get('email')?.value!,
    //   this.loginForm.get('password')?.value!);
    // if (this.authService.getToken() != null) {
    //   this.router.navigate(['/newTicket']);
    // }
    this.submitted = true;
    if(this.loginForm.valid) {
      this.authService.loginServer(this.loginForm.get('email')?.value!,
      this.loginForm.get('password')?.value!, true);
      this.invalidCredentials = true;
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
