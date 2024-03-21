import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public currentUser: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
    const data = localStorage.getItem('data') || '{}';
    this.currentUser = JSON.parse(data).name.toString();
  }

  logout() {
    localStorage.removeItem('data');
    this.router.navigate(['/home']);
  }

}
