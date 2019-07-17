import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { RunnerService } from 'src/app/services/runner.service';
import { AwsAuthService } from 'src/app/services/aws-auth.service';

@Component({
  selector: 'app-log-my-run',
  templateUrl: './log-my-run.component.html',
  styleUrls: ['./log-my-run.component.css']
})
export class LogMyRunComponent implements OnInit, OnDestroy {
  logMyRunForm: FormGroup;
  start = '2019-05-26';
  end = '2019-10-31';
  loading = '';
  error = '';
  timestampOutOfRange = '';
  subscription: Subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private runnerService: RunnerService,
    private awsAuthService: AwsAuthService) {
  }

  ngOnInit() {
    this.logMyRunForm = this.formBuilder.group({
      date: [this.getCurrentDate(), [
        Validators.required,
      ]],

      milesRun: [null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(50.0),
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
      ]],
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.loading = 'loading';
    this.timestampOutOfRange = '';
    const dateRun = this.logMyRunForm.get('date').value;
    const milesRun = this.logMyRunForm.get('milesRun').value;

    const dateInMs = Date.parse(dateRun);

    if (dateInMs >= Date.parse(this.start) &&
      dateInMs <= Date.parse(this.end) &&
      dateInMs <= Date.parse(this.getCurrentDate())) {
        this.subscription = this.runnerService
        .add(dateRun, milesRun).subscribe(
          response => {
            this.error = '';
            const timer = Observable.timer(300);
            timer.subscribe(() => this.loading = 'done');
          },
          error => {
            this.loading = 'error';
            this.awsAuthService.logOut();
            this.router.navigate(['/login'], { skipLocationChange: true });
          }
        );

    } else {
      this.loading = '';
      this.timestampOutOfRange = 'Enter date between ' + this.start + ' to ' + this.end;
    }
    this.logMyRunForm.reset();
    this.logMyRunForm.setValue({ date: this.getCurrentDate(), milesRun: null });
  }

  private getCurrentDate() {
    const date = new Date();
    let dd = date.getDate().toString();
    let mm = (date.getMonth() + 1).toString();

    dd = dd.length === 2 ? dd : '0' + dd;
    mm = mm.length === 2 ? mm : '0' + mm;

    return [date.getFullYear(), '-', mm, '-', dd].join('');
  }
}
