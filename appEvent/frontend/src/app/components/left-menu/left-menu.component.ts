import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToCalendar() {
    this.router.navigate(['calendar'], {relativeTo:this.route});
  }

  dashboard() {
    this.router.navigate(['stats'], {relativeTo:this.route});
  }

  logout() {
    localStorage.removeItem('data');
    this.router.navigate(['/home']);
  }

}
