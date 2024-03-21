import { Injectable } from "@angular/core";

import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IEvent } from "src/app/interfaces/IEvent";
import { IUser } from "src/app/interfaces/IUser";

@Injectable({
  providedIn: 'root'
})

export class CalendarService {
  constructor(
    private _http: HttpClient
  ) {}

  createEvent(event: IEvent): Observable<any> {
    return this._http.post(`${environment.urlLocal}/event/createEvent`, event);
  }

  getEventsByUserId(userId: string): Observable<Array<IEvent>> {
    return this._http.get<Array<IEvent>>(`${environment.urlLocal}/event/getEventsById/${userId}`);
  }

  getAllUsers(): Observable<any> {
    return this._http.get<any>(`${environment.urlLocal}/user/getAllUsers`);
  }

  updateEvent(event: IEvent): Observable<any> {
    const eventId: string = event.id!;
    return this._http.patch(`${environment.urlLocal}/event/update/${eventId}`, event);
  }

}
