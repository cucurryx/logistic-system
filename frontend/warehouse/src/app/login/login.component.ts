import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: any;

  constructor(private authService: AuthService,
            private fb: FormBuilder,
            private router: Router,
            private dialog: MatDialog) {
    if (this.authService.getToken()) {
      this.router.navigate(['/']).then(r => console.log(`${r}`));
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
     console.log(`${JSON.stringify(this.form.getRawValue())}`);
     this.authService.login(this.form.getRawValue()).subscribe(
       r => {
         if (r.code == 200) {
           this.authService.removeToken();
           this.authService.setToken(r.data.access_token);
           this.router.navigate(['/']);
         }
       },
       e => {
         console.log(`login failed, err: ${e}`);
         this.dialog.open(LoginFailDialog);
       });
  }

  onAdmin() {
    const username = this.form.getRawValue().username;
    if (username != 'admin') {
      this.dialog.open(LoginFailDialog);
    } else {
      this.authService.login(this.form.getRawValue()).subscribe(
        r => {
          if (r.code == 200) {
            this.authService.removeToken();
            this.authService.setToken(r.data.access_token);
            this.router.navigate(['/register']);
          }
        },
        e => {
          console.log(`login failed, err: ${e}`);
          this.dialog.open(LoginFailDialog);
        });
    }
  }
}

@Component({
  selector: 'login-fail-dialog',
  templateUrl: 'login-fail-dialog.html',
})
export class LoginFailDialog {

  constructor(
    public dialogRef: MatDialogRef<LoginFailDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
