import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrderListComponent} from './order-list/order-list.component';
import {WarehouseReportComponent} from './warehouse-report/warehouse-report.component';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthService} from './services/auth.service';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full', canActivate: [AuthService] },
  { path: 'orders', component: OrderListComponent, canActivate: [AuthService] },
  { path: 'detail/:id', component: OrderDetailComponent, canActivate: [AuthService] },
  { path: 'report', component: WarehouseReportComponent, canActivate: [AuthService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
