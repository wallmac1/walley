import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isCollapsed: boolean = false;

  inputForm = new FormControl<string | null>(null);

  menu = [
    {
      name: 'Item 1',
      isExpanded: false,
      itemTwo: [
        {
          name: 'Subitem 1.1',
          isExpanded: false,
          itemThree: [
            { name: 'Subitem 1.1.1' },
            { name: 'Subitem 1.1.2' }
          ]
        },
        {
          name: 'Subitem 1.2',
          isExpanded: false,
          itemThree: [
            { name: 'Subitem 1.2.1' },
            { name: 'Subitem 1.2.2' }
          ]
        }
      ]
    },
    {
      name: 'Item 2',
      isExpanded: false,
      itemTwo: [
        {
          name: 'Subitem 2.1',
          isExpanded: false,
          itemThree: [
            { name: 'Subitem 2.1.1' },
            { name: 'Subitem 2.1.2' }
          ]
        }
      ]
    },
    {
      name: 'Item 3',
      isExpanded: false,
      itemTwo: [
        {
          name: 'Subitem 3.1',
          isExpanded: false,
          itemThree: []
        }
      ]
    },
  ];

  constructor() { }

  ngOnInit() {   
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleItem(item: any) {
    item.isExpanded = !item.isExpanded;
  }

}
