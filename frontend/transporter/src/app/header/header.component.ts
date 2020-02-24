import { Component, OnInit } from '@angular/core';
import {AppRoutingModule} from '../app-routing.module';
import {Router} from '@angular/router';
import {TransportReportComponent} from '../transport-report/transport-report.component';

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
    // tslint:disable-next-line:triple-equals
    return this.route.url != '/report';
  }
}
