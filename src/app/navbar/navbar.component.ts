import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

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
    ReactiveFormsModule,
    RouterOutlet
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isCollapsed: boolean = false;
  isSmall: boolean = true;
  isMedium: boolean = true;

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

  constructor() { 
    this.updateWindowDimensions();
  }

   // Listener per l'evento di ridimensionamento della finestra
   @HostListener('window:resize', ['$event'])
   onResize(event: Event): void {
     this.updateWindowDimensions();
   }
 
   // Metodo per aggiornare le dimensioni della finestra
   updateWindowDimensions(): void {
     if(window.innerWidth < 600) {
      this.isSmall = true;
      this.isMedium = false;
     }
     else if(window.innerWidth < 1100) {
      this.isSmall = false;
      this.isMedium = true;
     }
     else {
      this.isSmall = false;
      this.isMedium = false;
     }
   }

  ngOnInit() {   
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleItem(item: any) {
    item.isExpanded = !item.isExpanded;
  }

}
