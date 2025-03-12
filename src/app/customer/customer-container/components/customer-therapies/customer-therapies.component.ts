import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TherapyTable } from '../../../interfaces/therapy-table';
import { MatDialog } from '@angular/material/dialog';
import { TherapyPopupComponent } from '../../../pop-up/therapy-popup/therapy-popup.component';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Connect } from '../../../../classes/connect';
import { ApiResponse } from '../../../../weco/interfaces/api-response';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-customer-therapies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './customer-therapies.component.html',
  styleUrl: './customer-therapies.component.scss'
})
export class CustomerTherapiesComponent {

  @ViewChild('sort') sort!: Sort;
  @Input() idregistry: number = 0;
  dataSource = new MatTableDataSource<TherapyTable>([]);
  therapies: TherapyTable[] = [];
  displayedColumns: string[] = ['modify', 'therapy_date', 'totalsessions', 'description', 'info'];
  displayedColumnsSmall: string[] = ['smallScreenCol'];

  constructor(private dialog: MatDialog, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getTherapies();
  }

  modifyTherapy(therapy: TherapyTable) {
    this.openTherapyPopup(2, therapy!)
  }

  createTherapy() {
    this.openTherapyPopup(1, null)
  }

  deleteTherapy(idPopup: number, therapy: TherapyTable) {
    const dialogRef = this.dialog.open(TherapyPopupComponent, {
      maxWidth: '500px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: idPopup,
        therapyInfo: therapy,
        idregistry: this.idregistry
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // refresh
        this.getTherapies();
      }
    });
  }

  openTherapyPopup(idPopup: number, therapy: TherapyTable | null) {
    const dialogRef = this.dialog.open(TherapyPopupComponent, {
      maxWidth: '500px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: idPopup,
        therapyInfo: therapy,
        idregistry: this.idregistry
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // refresh
        this.getTherapies();
      }
    });
  }

  getTherapies() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'customer/therapiesList', { idregistry: this.idregistry, 
      orderby_creation: this.sort?.direction || 'desc' })
      .subscribe((val: ApiResponse<any>) => {
        if (val.data) {
          this.therapies = val.data.therapiesList;
          this.dataSource.data = this.therapies;
        }
      })
  }
}