import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IEvent } from 'src/app/interfaces/IEvent';
import { IUser } from 'src/app/interfaces/IUser';
import { CalendarService } from '../calendar-event-form/service/calendar.service';

@Component({
  selector: 'app-calendar-event-edit-form',
  templateUrl: './calendar-event-edit-form.component.html',
  styleUrls: ['./calendar-event-edit-form.component.scss']
})
export class CalendarEventEditFormComponent implements OnInit {

  @Input() openModal: boolean = false;
  @Input() eventToEdit: IEvent = {} as IEvent;
  @Output() closeModal = new EventEmitter<boolean>();

  public form!: FormGroup;

  public members: Array<IUser> = [];

  public membersToInvite: Array<string> =[];

  constructor(
    private formBuilder: FormBuilder,
    private $calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventToEdit'] && changes['eventToEdit'].currentValue) {
      this.createForm();
    }
  }

  getAllUsers() {
    this.$calendarService.getAllUsers().subscribe({
      next: (response: any) => {
        this.members = response.user;
        this.createForm();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  createForm() {
    const NAMEPATTERN: RegExp = /^[a-zA-Z ]+$/;

    let startDate: any = this['eventToEdit'].startDate || '';
    let endDate: any = this['eventToEdit'].endDate || '';

    // Verifica se as datas estão no formato ISO 8601 antes de formatá-las
    if (startDate instanceof Date && !isNaN(startDate.getTime())) {
        startDate = this.formatDate(new Date(startDate.getTime() - (3 * 60 * 60 * 1000))) + 'Z';
    }

    if (endDate instanceof Date && !isNaN(endDate.getTime())) {
        endDate = this.formatDate(new Date(endDate.getTime() - (3 * 60 * 60 * 1000))) + 'Z';
    }

    this.form = this.formBuilder.group({
      name: [this['eventToEdit'].name || '', [Validators.required, Validators.pattern(NAMEPATTERN)]],
      description: [this['eventToEdit'].description || '', [Validators.required, Validators.pattern(NAMEPATTERN)]],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, Validators.required],
      eventColor: [this['eventToEdit'].eventColor || '', [Validators.required]],
      checkboxes: this.formBuilder.group({})
    });

    // Adicionando controles para os checkboxes após obter os membros
    this.addCheckboxControls();
}

  addCheckboxControls() {
    const checkboxGroup = this.form.get('checkboxes') as FormGroup;
    this.members.forEach(member => {
      const memberId = member._id; // Supondo que _id seja o campo que contém o ID do usuário
      const isChecked = (this['eventToEdit'].members || []).includes(memberId); // Verifica se o ID do membro está na lista de membros do evento
      checkboxGroup.addControl(memberId, this.formBuilder.control(isChecked));
    });
  }

// Função para formatar a data no formato desejado ('DD/MM/AAAA HH:mm')
formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:00.000`;
}

  editEvent() {
    let data = localStorage.getItem('data') || '{}';

    const originalStartDate = this['eventToEdit'].startDate;
    const originalEndDate = this['eventToEdit'].endDate;

    // Convertendo as datas apenas se forem diferentes das originais
    let startDateISO = this.form.value.startDate !== originalStartDate ?
        new Date(this.form.value.startDate).toISOString() : originalStartDate;

    let endDateISO = this.form.value.endDate !== originalEndDate ?
        new Date(this.form.value.endDate).toISOString() : originalEndDate;

    let startDateISODate = new Date(startDateISO);

    startDateISODate.setHours(startDateISODate.getHours() - 3);

    let endDateISODate = new Date(endDateISO);

    endDateISODate.setHours(endDateISODate.getHours() - 3);

    startDateISO = startDateISODate.toISOString();
    endDateISO = endDateISODate.toISOString();

    let event: IEvent = {
      id: this['eventToEdit'].id,
      name: this.form.value.name,
      description: this.form.value.description,
      startDate: startDateISO,
      endDate: endDateISO,
      eventColor: this.form.value.eventColor,
      owner: JSON.parse(data!)._id.toString(),
      members: this['eventToEdit'].members && this['eventToEdit'].members.length > 0 ?
        this['eventToEdit'].members.concat(this.membersToInvite) :
        this.membersToInvite
    };

    // Envia o evento para atualização
    this.$calendarService.updateEvent(event).subscribe({
      next: (response: Partial<IEvent>) => {
        this.form.reset(); // Limpa o formulário
        this.emitCloseModal();
        window.location.reload(); // Recarrega a página após a atualização
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
}

  emitCloseModal() {
    this.form.get('endDate')?.disable();
    this.closeModal.emit(false);
  }

  doEnableEndDate() {
    if(this.form.value.startDate !== '') {
      this.form.get('endDate')?.enable();
    }
  }

  // Função para impedir a entrada direta no campo datetime-local
  blockUserTypeInInputTypeDate(event: KeyboardEvent) {
    event.preventDefault();
  }

  addMembers(member: IUser) {
    if(!this.membersToInvite.includes(member._id)) {
      this.membersToInvite.push(member._id);
    }else {
      let index = this.membersToInvite.indexOf(member._id);

      index !== -1 ? this.membersToInvite.splice(index, 1) : 'Member not found!';
    }
  }
}
