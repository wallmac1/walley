import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CourseManagePopupComponent } from '../components/course-manage-popup/course-manage-popup.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Course } from '../interfaces/course';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss'
})
export class CoursesListComponent {

  displayedColumns: string[] = ['name', 'note', 'active'];
  courseList: Course[] = [];
  dataSource = new MatTableDataSource<Course>([]);

  filterForm = new FormGroup({
    course: new FormControl<string | null>(null),
  });

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { 
    this.getCourseList();
  }

  getCourseList() {
    this.courseList = [
      {
        idcourse: 1,
        name: 'Corso Sicurezza Base',
        color: '#3498db',
        note: 'Corso obbligatorio per nuovi assunti',
        active: true,
        obsolete_date: ''
      },
      {
        idcourse: 2,
        name: 'Corso Antincendio',
        color: '#e74c3c',
        note: 'Aggiornamento annuale per personale operativo',
        active: 1,
        obsolete_date: ''
      },
      {
        idcourse: 3,
        name: 'Corso Primo Soccorso',
        color: '#2ecc71',
        note: 'Valido per 3 anni',
        active: false,
        obsolete_date: '2024-12-31'
      },
      {
        idcourse: 4,
        name: 'Corso GDPR',
        color: '#9b59b6',
        note: 'Formazione privacy e protezione dei dati',
        active: true,
        obsolete_date: ''
      }
    ];

    this.dataSource.data = this.courseList;
  }

  editOrCreateCoursePopup(course: Course | null = null) {
    const dialogRef = this.dialog.open(CourseManagePopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '90%',
      data: { course: course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if(result.action == 'add') {
          this.courseList.push(result.course);
          this.dataSource.data = this.courseList;
        }
        else if(result.action == 'modify') {
          const index = this.courseList.findIndex((c) => c.idcourse === result.course.idcourse);
          console.log(index);
          if(index > -1) {
            this.courseList[index] = result.course;
            this.dataSource.data = this.courseList;
          }
        }
      }
    });
  }

  applyFilter() {
    const filterValue = this.filterForm.get('course')?.value;
    if(filterValue != '' && filterValue != null) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    else {
      this.dataSource.data = this.courseList;
    }
  }

}
