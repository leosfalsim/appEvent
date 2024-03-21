import { Injectable } from "@angular/core";

import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ILogin } from "src/app/interfaces/ILogin";

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(
    private _http: HttpClient
  ) {}

  doLogin(login: ILogin): Observable<any>{
    return this._http.post(`${environment.urlLocal}/auth/loginUser`, login);
  }
}
