import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  valid: boolean = true;
  toggled: boolean = true;
  type: string = 'password'

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl<number>(0, Validators.required)
  })

  constructor(private router: Router) { }

  onSwitchChange(): void {
    const isChecked = this.loginForm.get('rememberMe')?.value;
    this.loginForm.get('rememberMe')?.setValue(isChecked ? 1 : 0);
  }

  async login() {
    console.log(this.loginForm.getRawValue());
    this.valid = !this.valid;
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
