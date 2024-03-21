import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//My Routes
import { RoutingModule } from './routing.module';
import { ComponentsModule } from '../components/components.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
    ComponentsModule
  ]
})
export class ViewsModule { }
