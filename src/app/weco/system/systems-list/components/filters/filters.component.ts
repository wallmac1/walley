import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Status } from '../../../../interfaces/step-status';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../../classes/connect';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    TranslateModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

  @Output() filterEmit = new EventEmitter<{ status: number | null }>

  statusList: {id: number, color: string, name: string | null, order: number | null}[] = [];

  filterForm = new FormGroup({
    status: new FormControl<number | null>(null)
  })

  constructor(private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getStatusList();
  }

  filter() {
    this.filterEmit.emit({ status: this.filterForm.get('status')?.value || null });
  }

  private getStatusList() {
    this.connectServerService.getRequest(Connect.urlServerLaraApi, 'systems/statusList', {}).subscribe((val: ApiResponse<any>) => {
      if (val) {
        this.statusList = val.data.statusList;
      }
    })
  }

}
