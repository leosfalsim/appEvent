import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEvent } from 'src/app/interfaces/IEvent';

@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.scss']
})
export class CalendarEventModalComponent implements OnInit {

  @Input() event = {} as IEvent;
  @Input() openModal: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  formateData(data: string): string {
    // Supondo que data é uma string no formato 'AAAA-MM-DDTHH:mm:ss.000'
    let originalDate = new Date(data);

    // Diminuindo 3 horas do fuso horário
    originalDate.setHours(originalDate.getHours() - 3);

    // Obtendo os componentes da data
    let day = originalDate.getDate().toString().padStart(2, '0');
    let month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do zero
    let year = originalDate.getFullYear().toString();
    let hour = originalDate.getHours().toString().padStart(2, '0');
    let minute = originalDate.getMinutes().toString().padStart(2, '0');

    // Formatar a data no formato 'DD/MM/AAAA HH:mm'
    let formatatedDate = `${day}/${month}/${year} ${hour}:${minute}`;

    return formatatedDate;
  }

  emitCloseModal() {
    this.closeModal.emit(false);
  }
}
