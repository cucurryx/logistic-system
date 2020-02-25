import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrderListComponent} from './order-list/order-list.component';
import {WarehouseReportComponent} from './warehouse-report/warehouse-report.component';
import {OrderDetailComponent} from './order-detail/order-detail.component';


export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrderListComponent },
  { path: 'detail/:id', component: OrderDetailComponent },
  { path: 'report', component: WarehouseReportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
