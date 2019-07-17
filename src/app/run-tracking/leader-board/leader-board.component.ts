import { Component, OnInit, OnDestroy } from '@angular/core';
import { Runner } from 'src/app/services/runner';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RunnerService } from 'src/app/services/runner.service';
import { AwsAuthService } from 'src/app/services/aws-auth.service';
import { CognitoUtils } from 'src/app/services/cognito-utils.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit, OnDestroy {
  runners: Runner[];
  subscription: Subscription;
  firstName = CognitoUtils.getUserFirstName();
  lastName = CognitoUtils.getUserLastName();

  constructor(
    private router: Router,
    private runnerService: RunnerService,
    private awsAuthService: AwsAuthService) { }

  ngOnInit() {
    console.log(this.firstName, this.lastName);
    this.subscription = this.runnerService.getRunners().subscribe(
      (runners) => {
        this.runners = runners;
      },
      (error) => {
        this.awsAuthService.logOut();
        this.router.navigate(['/login'], { skipLocationChange: true });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
