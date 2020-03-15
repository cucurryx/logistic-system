import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CurrentUserDialog, HeaderComponent} from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { OrderListComponent } from './order-list/order-list.component';
import {CreateFailDialog, CreateSuccessDialog, InvalidDataDialog, OrderCreateComponent} from './order-create/order-create.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoginComponent, LoginFailDialog} from './login/login.component';
import {RegisterComponent, RegisterFailDialog, RegisterSuccessDialog} from './register/register.component';
import {MatIconModule} from '@angular/material/icon';
import {httpInterceptorProviders} from './interceptors';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    OrderListComponent,
    OrderCreateComponent,
    OrderDetailComponent,
    InvalidDataDialog,
    CreateFailDialog,
    CreateSuccessDialog,
    LoginComponent,
    RegisterComponent,
    LoginFailDialog,
    RegisterSuccessDialog,
    RegisterFailDialog,
    CurrentUserDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatStepperModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
