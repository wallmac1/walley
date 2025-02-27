import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { EventTable } from '../interfaces/event-table';
import { Student } from '../../customer/interfaces/student';
import { Customer } from '../../customer/interfaces/customer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    TranslateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule
  ],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss'
})
export class EventsListComponent {

  filteredStudent$!: Observable<Student[]>;
  filteredCustomer$!: Observable<Customer[]>;
  submitted: boolean = false;
  displayedColumns: string[] = ['date', 'customer', 'course', 'start_time', 'end_time'];
  displayedColumnsSmall: string[] = ['smallScreenCol'];
  //customerList: EventTable[] = [];
  eventList: EventTable[] = [];
  dataSource = new MatTableDataSource<EventTable>([]);
  todayDate = new Date();
  orderby_creation: string | null = 'asc';
  orderby_update: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 50;
  courseList: { id: number, name: string }[] = [];
  isSmallScreen: boolean = false;

  filterForm = new FormGroup({
    isPeriod: new FormControl<number>(0),
    datefrom: new FormControl<Date | null>(new Date(this.todayDate)),
    dateto: new FormControl<Date | null>(new Date(this.todayDate)),
    people_isAll: new FormControl<boolean>(true),
    people_isCustomer: new FormControl<boolean>(false),
    people_isStudent: new FormControl<boolean>(false),
    customer: new FormControl<Customer | null>(null),
    student: new FormControl<Student | null>(null),
    event_isAll: new FormControl<boolean>(true),
    event_isOther: new FormControl<boolean>(false),
    event_isCourse: new FormControl<boolean>(false),
    course_type: new FormControl<number | null>(null),
    notEnded: new FormControl<number>(0),
  })

  ngOnInit(): void {
    this.getEvents();
    this.setDate();
    this.searchCustomer();
    this.searchStudent();
    this.initForm();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isSmallScreen = screenWidth < 576;
  }

  initForm() {
    this.filterForm.get('people_isAll')?.valueChanges.subscribe((result) => {
      this.peopleLogic(result!, 1);
    });
    this.filterForm.get('people_isCustomer')?.valueChanges.subscribe((result) => {
      console.log(result)
      this.peopleLogic(result!, 2);
    });
    this.filterForm.get('people_isStudent')?.valueChanges.subscribe((result) => {
      this.peopleLogic(result!, 3);
    });

    this.filterForm.get('event_isAll')?.valueChanges.subscribe((result) => {
      this.eventLogic(result!, 1);
    });
    this.filterForm.get('event_isOther')?.valueChanges.subscribe((result) => {
      this.eventLogic(result!, 2);
    });
    this.filterForm.get('event_isCourse')?.valueChanges.subscribe((result) => {
      this.eventLogic(result!, 3);
    });
  }

  peopleLogic(result: boolean, type: number) {
    if (!result) {
      // Se l'utente prova a deselezionare un'opzione già selezionata, la riattiviamo
      this.filterForm.get(this.getCheckboxName(type, 'people'))?.setValue(true, { emitEvent: false });
      return;
    }

    // Se viene selezionata un'opzione, deselezioniamo le altre
    this.filterForm.patchValue({
      people_isAll: type === 1,
      people_isCustomer: type === 2,
      people_isStudent: type === 3
    }, { emitEvent: false });
  }

  eventLogic(result: boolean, type: number) {
    if (!result) {
      // Se l'utente tenta di deselezionare l'unico selezionato, lo riattiviamo
      this.filterForm.get(this.getCheckboxName(type, 'event'))?.setValue(true, { emitEvent: false });
      return;
    }

    // Se viene selezionata una checkbox, deselezioniamo le altre
    this.filterForm.patchValue({
      event_isAll: type === 1,
      event_isOther: type === 2,
      event_isCourse: type === 3
    }, { emitEvent: false });
  }

  getEvents() {
    this.eventList = [
      {
        date: '2025-02-15',
        customer: 'Mario Rossi',
        course: 'Corso di Angular Avanzato',
        start_time: '09:00:00',
        end_time: '12:30:00'
      },
      {
        date: '2025-02-16',
        customer: 'Giulia Bianchi',
        course: 'Introduzione a TypeScript',
        start_time: '14:00:00',
        end_time: '17:30:00'
      },
      {
        date: '2025-02-17',
        customer: 'Luca Verdi',
        course: 'Masterclass su RxJS',
        start_time: '10:30:00',
        end_time: '13:00:00'
      },
      {
        date: '2025-02-18',
        customer: 'Anna Neri',
        course: 'Sviluppo di API con NestJS',
        start_time: '15:00:00',
        end_time: '18:00:00'
      },
      {
        date: '2025-02-19',
        customer: 'Paolo Esposito',
        course: 'Full-Stack con Angular e Node.js',
        start_time: '08:30:00',
        end_time: '12:00:00'
      }
    ];

    this.dataSource.data = this.eventList;
  }

  private getCheckboxName(type: number, category: 'people' | 'event'): string {
    const mapping: any = {
      people: {
        1: 'people_isAll',
        2: 'people_isCustomer',
        3: 'people_isStudent'
      },
      event: {
        1: 'event_isAll',
        2: 'event_isOther',
        3: 'event_isCourse'
      }
    };
    return mapping[category][type] || '';
  }

  private setDate() {
    const threeMonthsAgo = new Date(this.todayDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    this.filterForm.get('datefrom')?.setValue(threeMonthsAgo);
  }

  filter() {
    // RICHIESTA AL SERVER CON I DATI FILTRATI
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      //this.getCustomerList();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      //this.getCustomerList();
    }
  }

  displayCustomerName(customer?: Customer): string {
    return customer ? customer.denomination! : '';
  }

  // private filterLines(lines: Lines[]) {
  //   if(lines.length > 0) {
  //     this.works = lines.filter(line => line.type_line === 1); // Lavori
  //     this.articles = lines.filter(line => line.type_line === 2); // Articoli
  //   }
  // }

  private searchCustomer() {
    const customer_field = this.filterForm.get('customer');
    if (customer_field) {
      this.filteredCustomer$ = customer_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denomination?.toLowerCase() || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getCustomers(value) : [])
        );
    }
  }

  private getCustomers(val: string): Observable<Customer[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const customers: Customer[] = [
      {
        idregistry: 1,
        naturalPerson: true,
        name: "Mario",
        surname: "Rossi",
        businessName: null,
        denomination: "Mario Rossi",
        fiscalcode: "RSSMRA80A01H501Z",
        vat: "IT12345678901",
        country: 12,
        sameCode: false,
        email: "mario.rossi@example.com",
        pec: "mario.rossi@pec.it",
        phoneNumber: "+39 328 1234567",
        fax: "+39 06 9876543",
        website: "https://www.mariorossi.com",
        eori: "IT 123456789 12345",
        gender: 1,
        birth_country: 12,
        birth_city: "Roma",
        birth_city_it: { id: 1, name: "Roma", idprovince: 1, province_acronym: "RM", province_name: "Roma", idregion: 2, region_name: "Lazio", cadastral_code: "0000" },
        birthday: "1980-01-01",
        job: "Ingegnere",
        doctor: "Dr. Bianchi",
        specialist: "Cardiologo",
        sdi: "ABCDE12345",
        health_cf: {value: 1, description: "Descrizione"}
      },
      {
        idregistry: 2,
        naturalPerson: false,
        name: null,
        surname: null,
        businessName: "Tech Solutions SRL",
        denomination: "Tech Solutions SRL",
        fiscalcode: "TCHSLS80A01H501Z",
        vat: "IT98765432109",
        country: 12,
        sameCode: false,
        email: "info@techsolutions.it",
        pec: "techsolutions@pec.it",
        phoneNumber: "+39 06 12345678",
        fax: "+39 06 8765432",
        website: "https://www.techsolutions.it",
        eori: "IT 987654321 67890",
        gender: null,
        birth_country: null,
        birth_city: null,
        birth_city_it: null,
        birthday: null,
        job: null,
        doctor: null,
        specialist: null,
        sdi: "FGHIJ67890",
        health_cf: {value: 1, description: "Descrizione"}
      },
      {
        idregistry: 3,
        naturalPerson: true,
        name: "Laura",
        surname: "Bianchi",
        businessName: null,
        denomination: "Laura Bianchi",
        fiscalcode: "BNCLRA85C41H501Z",
        vat: "IT56473829106",
        country: 12,
        sameCode: false,
        email: "laura.bianchi@example.com",
        pec: "laura.bianchi@pec.it",
        phoneNumber: "+39 328 7654321",
        fax: "+39 06 2345678",
        website: "https://www.laurabianchi.com",
        eori: "IT 567832910 12345",
        gender: 2,
        birth_country: 12,
        birth_city: "Milano",
        birth_city_it: { id: 2, name: "Milano",idprovince: 1, province_acronym: "RM", province_name: "Milano", idregion: 2, region_name: "Lombardia", cadastral_code: "0000"},
        birthday: "1985-03-10",
        job: "Avvocato",
        doctor: "Dr. Verdi",
        specialist: "Penalista",
        sdi: "KLMNO11223",
        health_cf: {value: 1, description: "Descrizione"}
      }
    ];

    // Restituisce la lista come Observable
    return of(customers.filter(customer =>
      customer.denomination?.toLowerCase().includes(val.toLowerCase())
    ));
  }

  displayStudentName(student?: Student): string {
    return student ? student?.denomination! : '';
  }

  // private filterLines(lines: Lines[]) {
  //   if(lines.length > 0) {
  //     this.works = lines.filter(line => line.type_line === 1); // Lavori
  //     this.articles = lines.filter(line => line.type_line === 2); // Articoli
  //   }
  // }

  private searchStudent() {
    const student_field = this.filterForm.get('student');
    if (student_field) {
      this.filteredStudent$ = student_field.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.denomination?.toLowerCase() || ''),
          filter(value => value.length > 0),
          debounceTime(400),
          switchMap((value: string) =>
            value ? this.getStudents(value) : [])
        );
    }
  }

  private getStudents(val: string): Observable<Student[]> {
    // CHIAMATA AL SERVER
    // return this.connectServerService.getRequest<ApiResponse<{ city: Customer[] }>>(Connect.urlServerLaraApi, 'cities',
    //   {
    //     query: val
    //   }).pipe(
    //     map(response => response.data.cities)
    //   );
    // Esempio di una lista di tre clienti
    const students: Student[] = [
      {
        idregistry: 1,
        idstudent: 1,
        name: "Giulia",
        surname: "Ferrari",
        denomination: "Giulia Ferrari",
        fiscalcode: "FRRGIU98T41H501Z",
        birthday: "1998-04-01",
        email: "giulia.ferrari@example.com",
        phone: "+39 328 1234567"
      },
      {
        idregistry: 2,
        idstudent: 2,
        name: "Luca",
        surname: "Rossi",
        denomination: "Luca Rossi",
        fiscalcode: "RSSLCU95M12H501Z",
        birthday: "1995-12-10",
        email: "luca.rossi@example.com",
        phone: "+39 334 9876543"
      },
      {
        idregistry: 3,
        idstudent: 3,
        name: "Martina",
        surname: "Bianchi",
        denomination: "Martina Bianchi",
        fiscalcode: "BNCMRT92L30H501Z",
        birthday: "1992-07-30",
        email: "martina.bianchi@example.com",
        phone: "+39 320 4567890"
      },
    ];

    // Restituisce la lista come Observable
    return of(students.filter(students =>
      students.denomination?.toLowerCase().includes(val.toLowerCase())
    ));
  }

}
