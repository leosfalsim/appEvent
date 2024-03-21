import { Injectable } from "@angular/core";

import { HttpClient } from '@angular/common/http';
import { ILogin } from "src/app/interfaces/ILogin";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class SignupService {
  constructor(
    private _http: HttpClient
  ) {}

  createUser(user: ILogin): Observable<any> {
    return this._http.post(`${environment.urlLocal}/user/createUser`, user);
  }

}
