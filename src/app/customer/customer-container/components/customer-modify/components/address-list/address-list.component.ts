import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../../../../invoices/interfaces/country';
import { ConnectServerService } from '../../../../../../services/connect-server.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddressPopupComponent } from '../../../../../pop-up/address-popup/address-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Address } from '../../../../../../invoices/interfaces/address';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatAutocompleteModule,
    FormsModule
  ],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent {

  @Input() addressList: Address[] = [];
  @Input() idcustomer: number = 0;
  @Input() countriesList: Country[] = [];
  @Output() refreshAddressList = new EventEmitter<null>;
  descriptionRows: number = 2;
  submitted: boolean = false;
  addressForm!: FormGroup;

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private dialog: MatDialog) {
    this.addressForm = this.fb.group({
      addresses: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 992) {
      this.descriptionRows = 2;
    }
    else {
      this.descriptionRows = 1;
    }
  }

  deleteAddressPopup(idlocation: number) {
    const dialogRef = this.dialog.open(AddressPopupComponent, {
      maxWidth: '600px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        idlocation: idlocation,
        idpopup: 2,
        idregistry: this.idcustomer,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // se è stato eliminato allora elimina dalla lista
        this.refreshAddressList.emit();
      }
    })
  }

  modifyAddressPopup(address: any, idpopup: number) {
    const dialogRef = this.dialog.open(AddressPopupComponent, {
      maxWidth: '1200px',
      minWidth: '350px',
      maxHeight: '600px',
      width: '90%',
      data: {
        address: address,
        idregistry: this.idcustomer,
        idpopup: idpopup,
        countriesList: this.countriesList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.obj) {
        // Se è stato correttamente salvato sul server aggiorna. Se insertion == 0 inserisci.
        this.refreshAddressList.emit();
      }
    })
  }

  newAddress() {
    this.modifyAddressPopup(null, 1);
  }
}
