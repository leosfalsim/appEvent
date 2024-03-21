import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Guard
import { AuthorizationGuard } from '../guards/authorization.guard';

// My Components
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsComponent } from '../components/stats/stats.component';
import { CalendarComponent } from '../components/calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthorizationGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full',
      },
      {
        path: 'stats',
        component: StatsComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
