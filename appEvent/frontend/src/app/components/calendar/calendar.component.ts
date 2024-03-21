import { Component, VERSION } from '@angular/core';
import { IEvent } from 'src/app/interfaces/IEvent';
import { CalendarService } from './calendar-event-form/service/calendar.service';
import { IDay } from 'src/app/interfaces/IDay';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent {

public daysOfWeek: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

currentDate: Date = new Date();
selectedDate: Date | null = null;

daysInMonth: IDay[] = [];

isEventDay: boolean = false;

// Definição dos eventos
events: IEvent[] = [];

// Just only event
event = {} as IEvent;

// Open Modal
openModal: boolean = false;
openModalForm: boolean = false;
openModalEditForm: boolean = false;

public userId: string = '';

eventToEdit: IEvent = {} as IEvent;

constructor(
  private $calendarService: CalendarService
) {}

ngOnInit() {
  this.getEventsByUserId();
}

getEventsByUserId() {
  const data = localStorage.getItem('data') || '{}';
  if(data) {
    this.userId = JSON.parse(data)._id.toString();
    this.$calendarService.getEventsByUserId(this.userId).subscribe((response: Array<IEvent>) => {
      this.events = response.map(event => ({
        id: event._id!,
        name: event.name,
        startDate: this.formatDateToString(new Date(event.startDate)),
        endDate: this.formatDateToString(new Date(event.endDate)),
        eventColor: event.eventColor,
        members: event.members,
        owner: event.owner,
        description: event.description
      }));
      this.generateCalendarDays(this.currentDate);
    });
  }
}

formatDateToString(date: Date): string {
  const isoString = date.toISOString(); // Obtém a data em formato ISO8601 com fuso horário UTC
  return isoString.slice(0, -1); // Remove o último caractere ('Z' indicando UTC) da string
}

generateCalendarDays(date: Date): void {
  this.daysInMonth = [];

  const today = new Date(); // Data de hoje

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const totalDays = lastDayOfMonth.getDate(); // Total de dias no mês

  // Preenche os dias do mês anterior, se necessário
  const startDayOfWeek = firstDayOfMonth.getDay(); // Dia da semana do primeiro dia do mês
  const prevMonthDaysCount = startDayOfWeek === 0 ? 6 : startDayOfWeek; // Dias do mês anterior a exibir
  const prevMonthLastDay = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), 0);

  // Adiciona os dias do mês anterior em ordem crescente
  for (let i = prevMonthDaysCount - 1; i >= 0; i--) {
    const prevDate = new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i);
    const event = this.getEventForDate(prevDate);
    this.daysInMonth.push({ date: prevDate, dayOfWeek: prevDate.getDay(), isToday: false, hasEvent: !!event, eventId: event ? event.id : null, eventColor: event ? event.eventColor : '#ffffff'});
  }

  // Preenche os dias do mês atual
  for (let i = 1; i <= totalDays; i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    const isToday = this.isCurrentMonthAndDay(today, currentDate);
    const event = this.getEventForDate(currentDate);
    this.daysInMonth.push({ date: currentDate, dayOfWeek: currentDate.getDay(), isToday, hasEvent: !!event, eventId: event ? event.id : null, eventColor: event ? event.eventColor : '#ffffff' });
  }

  // Preenche os dias do próximo mês, se necessário, para completar a semana
  const nextMonthDaysCount = 42 - this.daysInMonth.length; // Total de dias para completar 6 semanas
  const nextMonthFirstDay = new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth() + 1, 1);

  for (let i = 1; i <= nextMonthDaysCount; i++) {
    const nextDate = new Date(nextMonthFirstDay.getFullYear(), nextMonthFirstDay.getMonth(), i);
    const event = this.getEventForDate(nextDate);
    this.daysInMonth.push({ date: nextDate, dayOfWeek: nextDate.getDay(), isToday: false, hasEvent: !!event, eventId: event ? event.id : null, eventColor: event ? event.eventColor : '#ffffff'});
  }
}

getEventForDate(date: Date): IEvent | undefined {
  return this.events.find(event => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);

    // Ajuste na lógica para verificar se a data está dentro do intervalo correto do evento
    const isWithinRange = date.getTime() >= eventStartDate.getTime() && date.getTime() <= eventEndDate.getTime();
    const isStartDate = this.isSameDate(date, eventStartDate);
    const isEndDate = this.isSameDate(date, eventEndDate);

    return isWithinRange || isStartDate || isEndDate;
  });
}

// Função para verificar se duas datas são iguais (apenas dia, mês e ano)
isSameDate(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

  isCurrentMonthAndDay(today: Date, dateToCheck: Date): boolean {
    return today.getMonth() === dateToCheck.getMonth() && today.getDate() === dateToCheck.getDate();
  }

  selectDate(eventId: any): void {

    this.openModal = true;

    if(eventId){
      this.event = this.events.find(event => event.id === eventId.eventId)!;
    }
  }

  createEvent() {
    this.openModalForm = true;
  }

  prevMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendarDays(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendarDays(this.currentDate);
  }

  getMonthYearLabel(): string {
    const options = { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;
    return this.currentDate.toLocaleDateString('pt-BR', options).toLocaleUpperCase();
  }

  closeModal(event: boolean) {
    this.openModal = event;
    this.openModalEditForm = event;
  }

  closeModalForm(event: boolean) {
    this.openModalForm = event;
  }

  getEventSelected(event: IEvent) {
    this.eventToEdit = event;
    this.openModalEditForm = true;
  }
}
