import { CalendarDayModule, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarMonthModule, CalendarView, CalendarWeekModule, DateAdapter } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, add } from 'date-fns';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventManagePopupComponent } from '../components/event-manage-popup/event-manage-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { EventInfoPopupComponent } from '../components/event-info-popup/event-info-popup.component';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar-container',
  standalone: true,
  imports: [
    CommonModule,
    CalendarDayModule,
    CalendarWeekModule,
    CalendarMonthModule,
    ReactiveFormsModule,
    CalendarModule,
    TranslateModule
  ],
  templateUrl: './calendar-container.component.html',
  styleUrl: './calendar-container.component.scss',
})
export class CalendarContainerComponent {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  weekStartsOn: number = 1;
  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...colors['yellow'] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];


  activeDayIsOpen: boolean = true;

  constructor( private dialog: MatDialog) { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if(action === 'Clicked') {
      const dialogRef = this.dialog.open(EventInfoPopupComponent, {
        maxWidth: '900px',
        minWidth: '350px',
        maxHeight: '800px',
        width: '94%',
        data: {id: event.id}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result != null) {
          this.editOrCreateEventPopup(result);
        }
      });
    }
  }

  editOrCreateEventPopup(idevent: number = 0) {
    const dialogRef = this.dialog.open(EventManagePopupComponent, {
      maxWidth: '900px',
      minWidth: '350px',
      maxHeight: '800px',
      width: '94%',
      data: {type: 0, idevent: idevent}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if(result.action === 'add') {
          this.addEvent(result);
        }
        else {
          // CHIAMATA AL SERVER PER RICARICARE GLI EVENTI
        }
      }
    });
  }

  getEvents() {
    // CHIAMATA AL SERVER PER PRENDERE GLI EVENTI
  }

  addEvent(result: {event: any, idevent: number }): void {
    this.events = [
      ...this.events,
      {
        title: result.event.title,
        start: startOfDay(new Date(result.event.date_start)),
        end: endOfDay(new Date(result.event.date_end)),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
