import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

export interface List {
  id: number;
  year: string;
  name: string;
  notes: string;
  created_at: string | null; 
}

@Component({
  selector: 'app-list-years',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
  templateUrl: './list-years.component.html',
  styleUrl: './list-years.component.scss'
})
export class ListYearsComponent {

  displayedColumns: string[] = ['year', 'name', 'notes'];
  lists: List[] = [];
  dataSource : MatTableDataSource<List>;
  constructor(private http: HttpClient){
    this.dataSource = new MatTableDataSource<List>([]);
    this.getLists();
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getLists(){
    this.http.get<List[]>('/api/lists').subscribe({
    next: (data) => {
      this.lists = data;
      console.log(this.lists);
      this.dataSource = new MatTableDataSource(this.lists);
      
    },
    error: (err) => {
      console.error(err);
    }
  });
  }

}
