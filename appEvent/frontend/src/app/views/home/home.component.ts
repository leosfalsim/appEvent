import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  activeTab: number = 1;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('data')){
      this.router.navigate(['/dashboard']);
    }
  }

  activateTab(tabNumber: number): void {
    this.activeTab = tabNumber;
  }

}
