import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authorizations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './authorizations.component.html',
  styleUrl: './authorizations.component.scss'
})
export class AuthorizationsComponent {
  displayedColumns: string[] = ['email', 'name', 'surname', 'country', 'authorizations'];

  authorizationsForm: FormGroup = this.fb.group({
    authorizations: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.popolateAuthorizationsForm();
  }

  popolateAuthorizationsForm() {
    // CHIAMATA AL SERVER PER OTTENERE LE AUTORIZZAZIONI
    this.authorizations.clear(); // Svuota il form prima di popolarlo di nuovo

    this.permissions.forEach(item => {
      const element = this.fb.group({
        id: [item.id],
        name: [item.name],
        surname: [item.surname],
        country: [item.country],
        email: [item.email],
        permission: [item.permission],
        info: [item.info]
      })
      
      this.authorizations.push(element);
    });
  }

  get authorizations() {
    return this.authorizationsForm.get('authorizations') as FormArray;
  }

  save() {
    this.authorizations.controls.forEach(element => {
      if(element.get('permission')?.value == true) {
        element.get('permission')?.setValue(1);
      }
      else if(element.get('permission')?.value == false) {
        element.get('permission')?.setValue(0);
      }
    });
    console.log(this.authorizationsForm.getRawValue())
  }

  permissions = [
    {
      id: 1,
      email: 'john@gmail.com',
      name: 'John',
      surname: 'Doe',
      country: 'USA',
      info: 'Manager at Tech Corp',
      permission: 0
    },
    {
      id: 2,
      email: 'jane@gmail.com',
      name: 'Jane',
      surname: 'Smith',
      country: 'UK',
      info: 'Software Engineer',
      permission: 0
    },
    {
      id: 3,
      email: 'carlos@gmail.com',
      name: 'Carlos',
      surname: 'Garcia',
      country: 'Spain',
      info: 'Product Owner',
      permission: 1
    },
    {
      id: 4,
      email: 'anna@gmail.com',
      name: 'Anna',
      surname: 'Ivanova',
      country: 'Russia',
      info: 'Business Analyst',
      permission: 1
    },
    {
      id: 5,
      email: 'yuki@gmail.com',
      name: 'Yuki',
      surname: 'Tanaka',
      country: 'Japan',
      info: 'Marketing Specialist',
      permission: 0
    }
  ];
}
