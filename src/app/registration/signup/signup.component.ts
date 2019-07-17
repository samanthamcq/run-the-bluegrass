import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

import { AwsAuthService } from 'src/app/services/aws-auth.service';
import { matchingPasswords } from 'src/app/services/password-utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading: string;
  error: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private awsAuthService: AwsAuthService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,
      ]],

      lastName: ['', [
        Validators.required]],

      email: ['', [
        Validators.required,
        Validators.email]],

      password: ['', [
        Validators.required,
        Validators.minLength(8)]],

      confirmPassword: ['', [
        Validators.required]],
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  onSubmit() {
    this.loading = 'loading';
    this.error = '';

    const firstName = this.signupForm.get('firstName').value;
    const lastName = this.signupForm.get('lastName').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    const timer = Observable.timer(1);

    timer.subscribe(() => {
      this.awsAuthService.registerNewUser(firstName, lastName, email, password)
        .then((user: CognitoUser | any) => {
          this.loading = '';
          this.error = '';
          this.router.navigate(['/signupConfirmation']);
        })
        .catch((error: any) => {
          this.error = error.message;
          this.loading = '';
          this.signupForm.reset();
        });
    });
  }
}


