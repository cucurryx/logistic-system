import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import {OrderListComponent, ReceiveFailDialog, ReceiveSuccessDialog} from './order-list/order-list.component';
import {CurrentUserDialog, HeaderComponent} from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {HttpClientModule} from '@angular/common/http';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RegisterComponent, RegisterFailDialog, RegisterSuccessDialog} from './register/register.component';
import {LoginComponent, LoginFailDialog} from './login/login.component';
import {httpInterceptorProviders} from './interceptors';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    OrderDetailComponent,
    OrderListComponent,
    HeaderComponent,
    FooterComponent,
    ReceiveFailDialog,
    ReceiveSuccessDialog,
    RegisterComponent,
    LoginComponent,
    LoginFailDialog,
    RegisterSuccessDialog,
    RegisterFailDialog,
    CurrentUserDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule,
    MatStepperModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
