import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';

@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent {

  isSmall: boolean = false;

  management_type: number | null = null; // 0 = no SN no QNT, 1 = si SN no QNT, 2 = si SN si QNT

  modifyForm = new FormGroup({
    unit_available: new FormControl<number | null>(null, Validators.required),
    quantity: new FormControl<string | null>(null, Validators.required),
    serialnumber: new FormControl<string | null>(null, Validators.required),
    unit_taxablepurchase: new FormControl<string | null>(null),
    vatpurchase: new FormControl<string | null>(null),
    unit_taxablerecommended: new FormControl<string | null>(null),
    vatrecommended: new FormControl<string | null>(null),
    pricerecommended: new FormControl<string | null>(null),
    pricepurchase: new FormControl<string | null>(null)
  })

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateWindowDimensions();
  }

  constructor(public dialogRef: MatDialogRef<ModifyComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Inizializza il form con i dati passati al dialog
    this.management_type = data.management_type;
    this.modifyForm.patchValue(data.article);
  }

  ngOnInit(): void {
    this.updateWindowDimensions();
  }

  updateWindowDimensions() {
    if (window.innerWidth < 767) {
      this.isSmall = true;
    }
    else {
      this.isSmall = false;
    }
  }

  modifyArticle() {
    // CHIAMATA AL SERVER PER MODIFICARE L'ARTICOLO
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
