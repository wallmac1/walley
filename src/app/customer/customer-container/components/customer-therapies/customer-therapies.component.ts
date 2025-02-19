import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TherapyTable } from '../../../interfaces/therapy-table';
import { MatDialog } from '@angular/material/dialog';
import { TherapyPopupComponent } from '../../../pop-up/therapy-popup/therapy-popup.component';

@Component({
  selector: 'app-customer-therapies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule
  ],
  templateUrl: './customer-therapies.component.html',
  styleUrl: './customer-therapies.component.scss'
})
export class CustomerTherapiesComponent {

  dataSource = new MatTableDataSource<TherapyTable>([]);
  therapies: TherapyTable[] = [];
  displayedColumns: string[] = ['modify', 'therapy_date', 'sessions', 'description', 'info'];
  displayedColumnsSmall: string[] = ['smallScreenCol'];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTherapies();
  }

  modifyTherapy(id: number) {
    const therapy = this.therapies.find((therapy) => therapy.id == id);
    this.openTherapyPopup(2, therapy!)
  }

  createTherapy() {
    this.openTherapyPopup(1, null)
  }

  deleteTherapy() {
  }

  openTherapyPopup(type: number, therapy: TherapyTable | null) {
    const dialogRef = this.dialog.open(TherapyPopupComponent, {
      maxWidth: '500px',
      minWidth: '350px',
      maxHeight: '500px',
      width: '90%',
      data: {
        idPopup: type,
        therapyInfo: therapy,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.type == 1) {
          this.therapies.push(result.therapy);
        }
        else {
          console.log(result.therapy)
          const index = this.therapies.findIndex((therapy) => therapy.id == result.therapy.id);
          this.therapies[index] = result.therapy;
        }

        this.dataSource.data = this.therapies;
      }
    });
  }

  getTherapies() {
    this.therapies = [
      {
        id: 1,
        therapy_date: "2023-05-20",
        sessions: "3",
        description: "Terapia di gruppo iniziale",
        info: {
          files: [
            { id: 101, src: "assets/files/therapy1_notes.pdf" },
            { id: 102, src: "assets/files/therapy1_photo.jpg" }
          ]
        }
      },
      {
        id: 2,
        therapy_date: "2023-06-01",
        sessions: "5",
        description: null,
        info: {
          files: [
            { id: 201, src: "assets/files/therapy2_report.pdf" }
          ]
        }
      },
      {
        id: 3,
        therapy_date: null,
        sessions: null,
        description: "Terapia individuale di follow-up",
        info: {
          files: []
        }
      }
    ]

    this.dataSource.data = this.therapies;
  }
}