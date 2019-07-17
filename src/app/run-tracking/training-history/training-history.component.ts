import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingRecord } from 'src/app/services/training-record';
import { RunnerService } from 'src/app/services/runner.service';
import { Router } from '@angular/router';
import { AwsAuthService } from 'src/app/services/aws-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.css']
})
export class TrainingHistoryComponent implements OnInit, OnDestroy {
  myTrainings: TrainingRecord[];
  faIcon = 'remove';
  selectedRow: number = null;
  totalMilesRun = 0.0;
  subscription: Subscription;
  deleteSubscription: Subscription;

  constructor(
    private router: Router,
    private runnerService: RunnerService,
    private awsAuthService: AwsAuthService) { }

  ngOnInit() {
    this.totalMilesRun = this.runnerService.getTotalMilesRun();
    this.subscription = this.runnerService.getTrainingRun().subscribe(
      (trainingRun) => {
        this.myTrainings = trainingRun;
      },
      (error) => {
        this.awsAuthService.logOut();
        this.router.navigate(['/login'], { skipLocationChange: true });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  delete(trainingRecord: TrainingRecord, row: number) {
    this.selectedRow = row;
    this.runnerService
      .delete(trainingRecord.timestamp, trainingRecord.miles_run)
      .subscribe(
        (response) => {
          this.selectedRow = null;
          this.totalMilesRun = this.runnerService.getTotalMilesRun();
        },
        (error) => {
          this.awsAuthService.logOut();
          this.router.navigate(['/login'], { skipLocationChange: true });
        }
      );
  }

  isSelected(index: number): boolean {
    if (this.selectedRow == null) {
      return false;
    }
    return this.selectedRow === index ? true : false;
  }
}
