import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { System } from '../../interfaces/system';

@Component({
  selector: 'app-systems-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './systems-list.component.html',
  styleUrl: './systems-list.component.scss'
})
export class SystemsListComponent {

  displayedColumns: string[] = ['date', 'user', 'system_name', 'system_status'];

  constructor() {}

  ngOnInit(): void {
    // CHIAMATA AL SERVER PER OTTENERE LA LISTA DI OGGETTI
  }

  systemList: System[] = [
    {
      idsystem: 101,
      date: '2024-10-21',
      denomination: 'System Alpha',
      title: 'Main System',
      status: {
        id: 1,
        name: 'Active',
        color: '008000'
      }
    },
    {
      idsystem: 102,
      date: '2024-09-15',
      denomination: 'System Beta',
      title: 'Backup System',
      status: {
        id: 2,
        name: 'Inactive',
        color: 'ff0000'
      }
    },
    {
      idsystem: 103,
      date: '2024-08-10',
      denomination: 'System Gamma',
      title: 'Test Environment',
      status: {
        id: 3,
        name: 'Maintenance',
        color: 'ffff00'
      }
    },
    {
      idsystem: 104,
      date: '2024-07-05',
      denomination: 'System Delta',
      title: 'Development System',
      status: {
        id: 1,
        name: 'Active',
        color: '008000'
      }
    },
    {
      idsystem: 105,
      date: '2024-06-25',
      denomination: 'System Epsilon',
      title: 'Legacy System',
      status: {
        id: 2,
        name: 'Inactive',
        color: 'ff0000'
      }
    }
  ]

}
