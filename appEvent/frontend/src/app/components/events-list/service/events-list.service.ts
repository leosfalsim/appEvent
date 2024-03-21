import { Injectable } from "@angular/core";

import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IEvent } from "src/app/interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})

export class EventsListService {

  constructor(
    private _http: HttpClient
  ) {}

  deleteCard(id: string): Observable<any>{
    return this._http.delete<any>(`${environment.urlLocal}/event/delete/${id}`);
  }

}

