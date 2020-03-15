import {Component, OnInit} from '@angular/core';
import {AppRoutingModule} from '../app-routing.module';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreateFailDialog} from '../transport-report/transport-report.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ AppRoutingModule, AuthService ]
})
export class HeaderComponent implements OnInit {
  createButton: boolean;

  constructor(private route: Router,
            private authService: AuthService,
              private dialog: MatDialog) {
    this.createButton = true;
  }

  ngOnInit(): void {
  }

  shouldDisplayCreateButton() {
    return this.route.url != '/report'
      && this.route.url != '/login'
      && this.route.url != '/register';
  }

  logOut() {
    this.authService.logout();
  }

  onCurrUser() {
    this.dialog.open(CurrentUserDialog)
  }
}


@Component({
  selector: 'current-user-dialog',
  templateUrl: 'current-user-dialog.html',
})
export class CurrentUserDialog {
  currUser: string;

  constructor(
    public dialogRef: MatDialogRef<CurrentUserDialog>,
    private authService: AuthService) {
    this.loadCurrUser();
  }

  loadCurrUser() {
    this.authService.getCurrUser().subscribe(
      r => {
        this.currUser = (r as any).data;
      },
      e => {
        this.currUser= '';
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

