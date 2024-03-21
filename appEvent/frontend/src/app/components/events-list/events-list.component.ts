import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { EventsListService } from './service/events-list.service';
import { IEvent } from 'src/app/interfaces/IEvent';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

  @Input() events: Array<IEvent> = [];
  @Input() userId: string = '';
  @Output() eventSelected = new EventEmitter<IEvent>();

  constructor(
    private $eventsListService: EventsListService
  ) {}

  ngOnInit(): void {}

  editEvent(event: IEvent) {
    this.eventSelected.emit(event);
  }

  deleteEvent(event: IEvent) {
    this.$eventsListService.deleteCard(event.id!).subscribe({
      next: (response: any) => {
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

}
