import {Component, NgZone, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {OrderCreateComponent} from '../order-create/order-create.component';
import {AppRoutingModule} from '../app-routing.module';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ AppRoutingModule, AuthService ]
})
export class HeaderComponent implements OnInit {
  createButton: boolean;
  currUser: string;

  constructor(private route: Router,
            private authService: AuthService) {
    this.createButton = true;
  }

  ngOnInit(): void {
    this.getCurrUser();
  }

  shouldDisplayCreateButton() {
    return this.route.url != '/create'
      && this.route.url != '/login'
      && this.route.url != '/register';
  }

  logOut() {
    this.authService.logout();
  }

  getCurrUser() {
    this.loadCurrUser();
    return this.currUser;
  }

  loadCurrUser() {
    this.authService.getCurrUser().subscribe(
      r => {
        this.currUser = (r as any).data;
      },
      e => {
        this.currUser= '出现未知错误';
      }
    );
  }
}
