import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AddVatPopupComponent } from './components/add-vat-popup/add-vat-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { ConnectServerService } from '../../services/connect-server.service';
import { Connect } from '../../classes/connect';
import { ApiResponse } from '../interfaces/api-response';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-vat-list-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule
  ],
  templateUrl: './vat-list-monitoring.component.html',
  styleUrl: './vat-list-monitoring.component.scss'
})
export class VatListMonitoringComponent {

  // IDENTIFIER = VAT / LICENSE NUMBER / FISCALCODE
  dataSource = new MatTableDataSource<{ id: number, identifier: string }>([]);
  fullIdentifierList: { id: number, identifier: string }[] = []
  displayedColumns: string[] = ['identifier', 'actions'];
  sortDirection = 'desc';

  filterForm = new FormGroup({
    search: new FormControl<string | null>(null, Validators.required)
  })

  constructor(private dialog: MatDialog, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getIdentifierList();
    this.filterForm.get('search')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.searchIdentifier();
      });
  }

  sortIdentifier(sort?: Sort) {
    if (sort) {
      this.sortDirection = sort.direction;
    }
    let orderedList = this.dataSource.data
    this.dataSource.data = orderedList.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.identifier > b.identifier ? 1 : a.identifier < b.identifier ? -1 : 0;
      } else {
        return a.identifier < b.identifier ? 1 : a.identifier > b.identifier ? -1 : 0;
      }
    });

  }

  getIdentifierList() {

    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'settings/monitoringIdentifierList', {})
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.dataSource.data = val.data.identifierList;
          this.fullIdentifierList = val.data.identifierList;
          this.sortIdentifier();
        }
      })
  }

  deleteIdentifier(element: { id: number, identifier: string }) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: { value: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const index = this.dataSource.data.findIndex(val => val.id == result.id);
        const updatedList = this.dataSource.data;
        updatedList.splice(index, 1);
        this.dataSource.data = updatedList;
      }
    });
  }

  addIdentifier() {
    const dialogRef = this.dialog.open(AddVatPopupComponent, {
      maxWidth: '700px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.dataSource.data.push(result);
        this.sortIdentifier();
      }
    });
  }

  searchIdentifier() {
    const value = this.filterForm.get('search')?.value;

    if (value) {
      const cleanValue = value.replace(/\s+/g, '').toLowerCase();

      const foundValue = this.fullIdentifierList.filter(val => {
        const cleanIdentifier = val.identifier.replace(/\s+/g, '').toLowerCase();
        return cleanIdentifier.includes(cleanValue);
      });

      this.dataSource.data = foundValue;
    } else {
      this.dataSource.data = this.fullIdentifierList;
    }
  }

}
