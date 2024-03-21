import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats/stats.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEventModalComponent } from './calendar/calendar-event-modal/calendar-event-modal.component.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { HeaderComponent } from './header/header.component';
import { EventsListComponent } from './events-list/events-list.component';
import { FilterByPropertyPipe } from './events-list/pipe/events-list.pipe';
import { CalendarEventFormComponent } from './calendar/calendar-event-form/calendar-event-form.component.component';
import { CalendarEventEditFormComponent } from './calendar/calendar-event-edit-form/calendar-event-edit-form.component.component';

@NgModule({
  declarations: [
    StatsComponent,
    CalendarComponent,
    CalendarEventModalComponent,
    CalendarEventFormComponent,
    LoginComponent,
    SignUpComponent,
    LeftMenuComponent,
    HeaderComponent,
    EventsListComponent,
    FilterByPropertyPipe,
    CalendarEventEditFormComponent
  ],
  exports: [
    StatsComponent,
    CalendarComponent,
    CalendarEventModalComponent,
    CalendarEventFormComponent,
    LoginComponent,
    SignUpComponent,
    LeftMenuComponent,
    HeaderComponent,
    EventsListComponent,
    CalendarEventEditFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
