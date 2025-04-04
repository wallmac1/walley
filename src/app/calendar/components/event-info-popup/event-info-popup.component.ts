import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { EventReadonly } from '../../../events/interfaces/event-readonly';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../weco/interfaces/api-response';

@Component({
  selector: 'app-event-info-popup',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './event-info-popup.component.html',
  styleUrl: './event-info-popup.component.scss'
})
export class EventInfoPopupComponent {

  event: EventReadonly | null = null;
  isSmallScreen: boolean = false;
  idevent: number = 0;

  constructor(public dialogRef: MatDialogRef<EventInfoPopupComponent>,
    private connectServerService: ConnectServerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idevent = data.id; // 0 MEMO, 1 GENERIC, 2 SALA, 3 COURSE

    // TEMPORANEO
    this.idevent = 101;
  }

  ngOnInit(): void {
    if (this.idevent > 0) {
      this.getEventInfo();
    }
  }

  getEventInfo() {
    // CHIAMATA REALE
    // this.connectServerService.getRequest(Connect.urlServerLaraApi, '', {idevent: this.idevent})
    //   .subscribe((val: ApiResponse<any>) => {
    //     if(val.data) {
    //       this.event = val.data.eventInfo;
    //     }
    //   })

    // TEMPORANEO
    this.event = {
      idevent: 101,
      event_type: { type: 1, name: 'GENERIC' },
      title: 'Meeting with Client',
      description: 'Quarterly business review with the client team.',
      internal: { type: 1, title: 'Internal' },
      date_start: '2025-04-10',
      date_end: '2025-04-10',
      time_start: '10:00',
      time_end: '12:00',
      isallday: 0,
      room: 'Sala Riunioni A',
      course: { id: 5, title: 'Corso Formazione Sicurezza', color: '#3498db' },
      contact: { id: 12, name: 'Mario Rossi' },
      customer: { id: 7, name: 'Azienda XYZ S.p.A.' },
      customer_headquarter: 'Milano, Via Torino 55',
      internal_person: 'Laura Bianchi',
      internal_headquarter: 2,
      keepinformed: 'andrea@example.com; laura@example.com'
    };
  }

  modify() {
    this.dialogRef.close(this.idevent);
  }

  close() { 
    this.dialogRef.close(null);
  }

}
