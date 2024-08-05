import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  toggled1: boolean = true;
  toggled2: boolean = true;
  type1: string = 'password';
  type2: string = 'password';

  validPassword: boolean = true;
  equalPassword: boolean = true;
  errorMessage: boolean = false;

  newPswForm = this.formBuilder.group({
    password: new FormControl<string>('', Validators.required),
    passwordRepeat: new FormControl<string>('', Validators.required),
  })

  constructor(private formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute, private dialog: MatDialog
  ) { }

  send() {
    const password = this.newPswForm.get('password')?.value;
    const passwordRepeat = this.newPswForm.get('passwordRepeat')?.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":|<>])(?=.{8,})/;
    if (regex.test(password!)) {
      if (password === passwordRepeat) {
        this.equalPassword = true;
        this.validPassword = true;
        this.errorMessage = false;
        // SERVER REQUEST
        const message = "The password was updated succesfully."
        const button = "Back to login"
        this.dialog.open(SuccessDialogComponent, {
          data: { message: message, button: button }
        });
      }
      else {
        this.equalPassword = false;
        this.validPassword = true;
        this.errorMessage = true;
      }
    }
    else {
      this.equalPassword = true;
      this.validPassword = false;
      this.errorMessage = true;
    }
  }

  checkPsw() {
    const password = this.newPswForm.get('password')?.value;
    const passwordRepeat = this.newPswForm.get('passwordRepeat')?.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":|<>])(?=.{8,})/;
    if (regex.test(password!)) {
      if (password === passwordRepeat) {
        this.equalPassword = true;
        this.validPassword = true;
        this.errorMessage = false;
      }
      else {
        this.equalPassword = false;
        this.validPassword = true;
        this.errorMessage = true;
      }
    }
    else {
      this.equalPassword = true;
      this.validPassword = false;
      this.errorMessage = true;
    }
  }

  seePassword(id: string) {
    if (id === 'passwordRepeat') {
      if (this.type2 === 'password') {
        this.type2 = 'text';
        this.toggled2 = false;
      }
      else {
        this.type2 = 'password';
        this.toggled2 = true;
      }
    }
    else {
      if (this.type1 === 'password') {
        this.type1 = 'text';
        this.toggled1 = false;
      }
      else {
        this.type1 = 'password';
        this.toggled1 = true;
      }
    }
  }

  goLogin() {
    this.router.navigate(['login']);
  }
}
