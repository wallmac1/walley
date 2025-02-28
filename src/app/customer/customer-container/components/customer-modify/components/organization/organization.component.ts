import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { City } from '../../../../../../invoices/interfaces/city';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { OrganizationPopupComponent } from '../../../../../pop-up/organization-popup/organization-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationTax } from '../../../../../interfaces/organization-tax';

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

  @Input() organizationTax: OrganizationTax | null = null;
  @Input() idregistry: number = 0;
  @Output() changedValues = new EventEmitter<null>;
  submitted: boolean = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {}

  organizationModifyPopup() {
    const dialogRef = this.dialog.open(OrganizationPopupComponent, {
      maxWidth: '800px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        idregistry: this.idregistry,
        organizationTax: this.organizationTax,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // salva sul server server ed assegna al form
        this.changedValues.emit();
      }
    })
  }

  // taxRepresentativeModifyPopup() {
  //   const dialogRef = this.dialog.open(OrganizationPopupComponent, {
  //     maxWidth: '800px',
  //     minWidth: '350px',
  //     maxHeight: '600px',
  //     width: '90%',
  //     data: {
  //       taxRepresentative: this.taxRepresentativeForm.getRawValue(),
  //       idpopup: 2,
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != null) {
  //       // salva sul server server ed assegna al form
  //       this.taxRepresentativeForm.patchValue(result.obj);
  //     }
  //   })
  // }

}
