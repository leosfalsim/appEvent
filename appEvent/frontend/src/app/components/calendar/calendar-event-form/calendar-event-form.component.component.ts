import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IEvent } from 'src/app/interfaces/IEvent';
import { IUser } from 'src/app/interfaces/IUser';
import { CalendarService } from '../calendar-event-form/service/calendar.service';

@Component({
  selector: 'app-calendar-event-form',
  templateUrl: './calendar-event-form.component.html',
  styleUrls: ['./calendar-event-form.component.scss']
})
export class CalendarEventFormComponent implements OnInit {

  @Input() openModal: boolean = false;
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

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(NAMEPATTERN)]],
      description: ['', [Validators.required, Validators.pattern(NAMEPATTERN)]],
      startDate: ['', [Validators.required]],
      endDate: [{ value: '', disabled: true }, Validators.required],
      eventColor: ['', [Validators.required]],
      checkboxes: this.formBuilder.group({})
    });

    // Adicionando controles para os checkboxes após obter os membros
    this.addCheckboxControls();
  }

  addCheckboxControls() {
    const checkboxGroup = this.form.get('checkboxes') as FormGroup;
    this.members.forEach(member => {
      checkboxGroup.addControl(member._id, this.formBuilder.control(false));
    });
  }

  createEvent() {
    let data = localStorage.getItem('data') || '{}';

    // Convertendo as datas para objetos Date
    let startDate = new Date(this.form.value.startDate);
    let endDate = new Date(this.form.value.endDate);

    // Subtraindo 3 horas das datas
    startDate.setHours(startDate.getHours() - 3);
    endDate.setHours(endDate.getHours() - 3);

    // Convertendo as datas ajustadas para strings no formato ISO 8601
    let startDateISO = startDate.toISOString();
    let endDateISO = endDate.toISOString();

    let event: IEvent = {
      name: this.form.value.name,
      description: this.form.value.description,
      startDate: startDateISO,
      endDate: endDateISO,
      eventColor: this.form.value.eventColor,
      owner: JSON.parse(data!)._id.toString(),
      members: this.membersToInvite
    };

    this.$calendarService.createEvent(event).subscribe({
      next: (response: Partial<IEvent>) => {
        this.form.reset();
        this.emitCloseModal();
        window.location.reload();
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
