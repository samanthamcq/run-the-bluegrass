import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AwsAuthService } from 'src/app/services/aws-auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private awsAuthService: AwsAuthService) { }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email]]
    });
  }

  onSubmit() {
    const email = this.resetPasswordForm.get('email').value;
    this.awsAuthService.forgotPassword(email)
      .then(() => {
        this.router.navigate(['/newPassword']);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
