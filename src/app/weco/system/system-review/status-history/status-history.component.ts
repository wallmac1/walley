import { Component, Input } from '@angular/core';
import { Status, StepStatus } from '../../../interfaces/step-status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-history',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './status-history.component.html',
  styleUrl: './status-history.component.scss'
})
export class StatusHistoryComponent {

  @Input() statusList: Status[] = [];


}
