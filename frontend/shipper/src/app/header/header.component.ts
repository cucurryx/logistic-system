import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {OrderCreateComponent} from '../order-create/order-create.component';
import {AppRoutingModule} from '../app-routing.module';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ AppRoutingModule ]
})
export class HeaderComponent implements OnInit {
  createButton: boolean;

  constructor(private route: Router) {
    this.createButton = true;
  }

  ngOnInit(): void {
  }

  shouldDisplayCreateButton() {
    return this.route.url != '/create';
  }
}
