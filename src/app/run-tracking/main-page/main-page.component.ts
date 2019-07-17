import { Component, OnInit } from '@angular/core';
import { CognitoUtils } from 'src/app/services/cognito-utils.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  userFullName = '';

  ngOnInit() {
    this.userFullName = CognitoUtils.getUserFirstName() + ' ' + CognitoUtils.getUserLastName();
  }
}
