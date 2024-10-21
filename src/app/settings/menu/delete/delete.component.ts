import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuVoice } from '../../../interfaces/menu-voices';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  deletionForm = new FormGroup({
    levelZero: new FormControl<MenuVoice | null>(null, Validators.required),
    levelOne: new FormControl<MenuVoice | null>(null),
    levelTwo: new FormControl<MenuVoice | null>(null), 
  })

  levelZeroSubVoices: MenuVoice[] = [
    { id: 1, name: "Main Menu 1", refidpage: 100 },
    { id: 2, name: "Main Menu 2", refidpage: 101 },
  ];
  
  levelZeroLastVoices: MenuVoice[] = [
    { id: 3, name: "About Us", refidpage: 200 },
    { id: 4, name: "Contact", refidpage: 201 },
  ];
  
  
  levelOneSubVoices: MenuVoice[] = [
    { id: 5, name: "Sub Menu 1-1", refidpage: 102 },
    { id: 6, name: "Sub Menu 1-2", refidpage: 103 },
    { id: 7, name: "Sub Menu 2-1", refidpage: 104 },
    { id: 8, name: "Sub Menu 2-2", refidpage: 105 },
  ];
  
  levelOneLastVoices: MenuVoice[] = [
    { id: 9, name: "Team", refidpage: 202 },
    { id: 10, name: "Careers", refidpage: 203 },
  ];
  

  levelTwoLastVoices: MenuVoice[] = [
    { id: 11, name: "FAQ", refidpage: 300 },
    { id: 12, name: "Support", refidpage: 301 },
    { id: 13, name: "Documentation", refidpage: 302 },
    { id: 14, name: "API Reference", refidpage: 303 },
  ];
  
  constructor() {
    console.log(this.deletionForm.getRawValue())
  }

  onSelect(event: any): void {  
    console.log(this.deletionForm.getRawValue());
    
    //EFFETTUARE CHIAMATA AL SERVER PER OTTENERE IL VALORE DELLE SOTTOVOCI COLLEGATE
  }

  deleteVoice(level: number, voice: MenuVoice) {
    if(level == 0) {
      //CHIAMATA AL SERVER PER ELIMINARE LA VOCE AL LIVELLO 0
    }
    else if(level == 1) {
      //CHIAMATA AL SERVER PER ELIMINARE LA VOCE AL LIVELLO 1
    }
    else if(level == 2) {
      //CHIAMATA AL SERVER PER ELIMINARE LA VOCE AL LIVELLO 2
    }
    
    
  }
}
