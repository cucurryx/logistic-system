import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CreateFailDialog} from '../transport-report/transport-report.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const username = this.form.getRawValue().username;
    const password = this.form.getRawValue().password;
    this.authService.register({username: username, password: password}).subscribe(
      r => {
        this.dialog.open(RegisterSuccessDialog)
      },
      e => {
        this.dialog.open(RegisterFailDialog)
      }
    )
  }
}

@Component({
  selector: 'register-fail-dialog',
  templateUrl: 'register-fail-dialog.html',
})
export class RegisterFailDialog {

  constructor(
    public dialogRef: MatDialogRef<RegisterSuccessDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'register-success-dialog',
  templateUrl: 'register-success-dialog.html',
  providers: [AuthService]
})
export class RegisterSuccessDialog {

  constructor(
    public dialogRef: MatDialogRef<RegisterSuccessDialog>,
    private authService: AuthService,
    private router: Router,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onBackLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }
}
