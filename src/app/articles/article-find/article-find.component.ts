import { Component } from '@angular/core';
import { AutocompleteSN } from '../interfaces/autocomplete-sn';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { ConnectServerService } from '../../services/connect-server.service';
import { ApiResponse } from '../../weco/interfaces/api-response';
import { Connect } from '../../classes/connect';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Article } from '../interfaces/article';

@Component({
  selector: 'app-article-find',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule
  ],
  templateUrl: './article-find.component.html',
  styleUrl: './article-find.component.scss'
})
export class ArticleFindComponent {

  filteredSerialnumber$!: Observable<AutocompleteSN[]>;
  dataSource = new MatTableDataSource<any>([]);
  article: Article | null = null;
  displayedColumns: string[] = ['iddocument', 'progressive', 'title', 'type', 'date', 'file'];

  filterForm = new FormGroup({
    serialnumber: new FormControl<AutocompleteSN | null>(null)
  })

  constructor(private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.searchSerialnumber();
  }

  displaySerialNumber(serialnumber?: AutocompleteSN): string {
    return serialnumber ? serialnumber.serialnumber! : '';
  }

  private searchSerialnumber() {
    const serialnumber_field = this.filterForm.get('serialnumber');
    if (serialnumber_field) {
      this.filteredSerialnumber$ = serialnumber_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.serialnumber || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getSerialnumber(value) : [])
        );
    }
    else {
      this.filteredSerialnumber$ = of([]);
    }
  }

  private getSerialnumber(val: string): Observable<AutocompleteSN[]> {
    return this.connectServerService.getRequest<ApiResponse<{ fiscalcode: AutocompleteSN[] }>>
      (Connect.urlServerLaraApi, 'aerticle/searchSn',
        {
          type: 1,
          query: val
        });
  }

}
