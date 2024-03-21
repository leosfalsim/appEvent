import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogin } from 'src/app/interfaces/ILogin';
import { SignupService } from './service/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit {

  public form!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private $signUpService: SignupService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    const NAMEPATTERN: RegExp = /^[a-zA-Z ]+$/;
    const EMAILPATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(NAMEPATTERN)]],
      email: ['', [Validators.required, Validators.pattern(EMAILPATTERN)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  createUser() {
    let user: ILogin = {
      name: this.form.value.name,
      email: this.form.value.email,
      password:this.form.value.password
    };

    this.$signUpService.createUser(user).subscribe({
      next: (response: ILogin) => {
        this.form.reset();
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

}
