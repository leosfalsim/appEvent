import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './service/login.service';
import { ILogin } from 'src/app/interfaces/ILogin';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private $loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    const EMAILPATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(EMAILPATTERN)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  doLogin() {
    let login: ILogin = {
      email: this.form.value.email,
      password:this.form.value.password
    };

    this.$loginService.doLogin(login).subscribe({
      next: (response: any) => {
        localStorage.setItem('data', JSON.stringify(response.data));
        this.router.navigate(['dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

}
