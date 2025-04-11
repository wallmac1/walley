import { Component, Input } from '@angular/core';
import { ArticleInputOutput } from '../interfaces/article-input-output';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ConnectServerService } from '../../services/connect-server.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-article-input-output-reserved',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule
  ],
  templateUrl: './article-input-output-reserved.component.html',
  styleUrl: './article-input-output-reserved.component.scss'
})
export class ArticleInputOutputReservedComponent {

  totalResults: number = 0;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalPages: number = 1;

  dataSource = new MatTableDataSource<ArticleInputOutput>([]);
  displayedColumns = ['id', 'document', 'type', 'serialnumber',];

  isSmall: boolean = false;

  @Input() idarticle: number = 0;
  @Input() type: number | null = null; // 0 = Reserved, 1 = Input, 2 = Output 

  constructor(private connecServerService: ConnectServerService) { }

  ngOnInit(): void {
    this.getHistoryInput();
  }

  prevPage() {

  }

  nextPage() {

  }

  getHistoryInput() {
    // CHIAMATA AL SERVER A SECONDA DEL TYPE
    let temporary = [
      {
        id: 1,
        document: 'DDT-1001',
        type: 'Ingresso',
        serialnumber: 'SN-001-A'
      },
      {
        id: 2,
        document: 'DDT-1002',
        type: 'Ingresso',
        serialnumber: 'SN-002-B'
      },
      {
        id: 3,
        document: 'DDT-1003',
        type: 'Ingresso',
        serialnumber: 'SN-003-C'
      }
    ];

    this.dataSource.data = temporary;
  }
}
