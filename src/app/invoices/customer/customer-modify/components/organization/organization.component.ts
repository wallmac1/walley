import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../../../interfaces/city';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { OrganizationPopupComponent } from '../../../../pop-up/organization-popup/organization-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent {

  @Input() organization: any = null;
  @Input() taxRepresentative: any = null;
  submitted: boolean = false;

  organizationForm = new FormGroup({
    municipality: new FormControl<City | null>({ value: null, disabled: true }),
    province: new FormControl<string | null>({ value: null, disabled: true }),
    postalcode: new FormControl<string | null>({ value: null, disabled: true }),
    street: new FormControl<string | null>({ value: null, disabled: true }),
    number: new FormControl<string | null>({ value: null, disabled: true }),
  })

  taxRepresentativeForm = new FormGroup({
    surname: new FormControl<string | null>({ value: null, disabled: true }),
    name: new FormControl<string | null>({ value: null, disabled: true }),
    denomination: new FormControl<string | null>({ value: null, disabled: true }),
    vat: new FormControl<string | null>({ value: null, disabled: true }),
  })

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { 
    if(this.organization) {
      this.organizationForm.patchValue(this.organization);
    }
    if(this.taxRepresentative) {
      this.taxRepresentativeForm.patchValue(this.taxRepresentative);
    }
  }

  organizationModifyPopup() {
    const dialogRef = this.dialog.open(OrganizationPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        organization: this.organizationForm.getRawValue(),
        idpopup: 1,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // salva sul server server ed assegna al form
        this.organizationForm.patchValue(result.obj);
      }
    })
  }

  taxRepresentativeModifyPopup() {
    const dialogRef = this.dialog.open(OrganizationPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        taxRepresentative: this.taxRepresentativeForm.getRawValue(),
        idpopup: 2,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // salva sul server server ed assegna al form
        this.taxRepresentativeForm.patchValue(result.obj);
      }
    })
  }

}
