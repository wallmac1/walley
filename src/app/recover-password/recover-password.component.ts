import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent {
  isSent: boolean = false;
  validEmail: boolean = true;

  recoverPswForm = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  constructor(private router: Router, private dialog: MatDialog) { }

  send() {
    //Send the request to the server
    const email_val = this.recoverPswForm.get('email')?.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email_val!)) {
      this.validEmail = true;
      this.isSent = true;
      // Send the request to the server
      const message = "An e-mail to recover your password has been sent to your address."
      const button = "Back to login"
      this.dialog.open(SuccessDialogComponent, {
        data: { message: message, button: button }
      });
    }
    else {
      this.validEmail = false;
    }
  }
  goLogin() {
    this.router.navigate(['login']);
  }
}
