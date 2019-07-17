import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AwsAuthService } from 'src/app/services/aws-auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: string;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private awsAuthService: AwsAuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email]],

      password: ['', [
        Validators.required]]
    });
  }

  onSubmit() {
    this.loading = 'loading';
    this.error = '';
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    const timer = Observable.timer(1);
    timer.subscribe(() => {
      this.awsAuthService.authenticateUser(email, password)
        .then(() => {
          this.loading = '';
          this.error = '';
          this.router.navigate(['/mainPage']);
        })
        .catch((error: any) => {
          this.error = error.message;
          this.loading = '';
          this.loginForm.reset();
          switch (error.code) {
            case 'UserNotConfirmedException':
              this.error =
                'A confirmation email has been sent to '
                + email
                + '. Click the link in the email to complete registration.  If you did not receive the email check your spam folder.';
              break;
          }
        });
    });
  }
}
