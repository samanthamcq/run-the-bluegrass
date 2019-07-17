import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AwsAuthService } from 'src/app/services/aws-auth.service';
import { matchingPasswords } from '../../services/password-utils';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private awsAuthService: AwsAuthService) { }

  ngOnInit() {
    this.newPasswordForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email]],

      verificationCode: ['', [
        Validators.required]],

      password: ['', [
        Validators.required,
        Validators.minLength(8)]],

      confirmPassword: ['', [
        Validators.required]],
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  onSubmit() {
    const email = this.newPasswordForm.get('email').value;
    const verificationCode = this.newPasswordForm.get('verificationCode').value;
    const password = this.newPasswordForm.get('password').value;
    this.awsAuthService.createNewPassword(email, verificationCode, password)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
