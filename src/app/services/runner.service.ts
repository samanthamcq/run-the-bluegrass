import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError, concatMap, tap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

import { Runner } from './runner';
import { TrainingRecord } from './training-record';
import { CognitoUtils } from './cognito-utils.service';

@Injectable(
  { providedIn: 'root' }
)
export class RunnerService {
  private myTrainings: TrainingRecord[];
  private runners: Runner[];
  private userId = CognitoUtils.getUserId();
  private url = CognitoUtils.getAPIURL();
  private runner = {
    id: this.userId,
    first_name: CognitoUtils.getUserFirstName(),
    last_name: CognitoUtils.getUserLastName(),
    full_name: CognitoUtils.getUserEmail(),
    total_miles: 0.0
  };

  constructor(private http: HttpClient) {
    this.getRunners().pipe(
      concatMap(
        (runners) => {
          this.runners = runners;
          if (this.searchRunners(this.userId) === -1) {
            this.runners.push(this.runner);
            return this.addNewRunner(this.runner);
          } else {
            return of(runners);
          }
        }
      ),
      concatMap(() => {
        return this.getTrainingRun();
      })
    ).subscribe(
      (myTrainings) => {
        this.myTrainings = myTrainings;
        for (const myTraining of this.myTrainings) {
          this.runner.total_miles = Number(this.runner.total_miles) + Number(myTraining.miles_run);
        }
      },
      (error) => {
        throwError(error);
      }
    );
  }

  addNewRunner(runner: Runner): Observable<any> {
    return this.http.post(this.url + '/runners', runner);
  }

  add(timestamp: string, milesRun: number): Observable<any> {
    const date = [timestamp, '-', Date.now()].join('');
    const body = {
      id: this.userId,
      timestamp: date,
      miles_run: milesRun,
    };
    return this.http.post(this.url + '/runners/' + this.userId + '/training-runs', body)
      .pipe(
        tap(res => {
          this.myTrainings.push(body);
          this.myTrainings = this.sortTrainingRun(this.myTrainings);

          const runnerIndex = this.searchRunners(this.userId);
          const newTotalMiles = Number(this.runners[runnerIndex].total_miles) + Number(milesRun);
          this.runner.total_miles = newTotalMiles;
          this.runners[runnerIndex].total_miles = newTotalMiles;
          this.runners = this.sortRunners(this.runners);
        })
      );
  }

  delete(timestamp: string, milesRun: number): Observable<any> {
    const body = {
      id: this.userId,
      timestamp: timestamp,
      miles_run: milesRun
    };
    return this.http.delete(this.url + '/runners/' + this.userId + '/training-runs/' + timestamp)
      .pipe(
        tap(res => {
          if (this.myTrainings && this.myTrainings.length > 0) {
            let index = -1;
            for (let i = 0; i < this.myTrainings.length; i++) {
              if ((this.myTrainings[i].timestamp === timestamp) &&
                (this.myTrainings[i].miles_run === milesRun)) {
                index = i;
                break;
              }
            }
            if (index > -1) {
              this.myTrainings.splice(index, 1);
            }
            const runnerIndex = this.searchRunners(this.userId);
            const newTotalMiles = Number(this.runners[runnerIndex].total_miles) - Number(milesRun);
            this.runner.total_miles = newTotalMiles;
            this.runners[runnerIndex].total_miles = newTotalMiles;
            this.runners = this.sortRunners(this.runners);
          }
        })
      );
  }

  getRunners(): Observable<Runner[]> {
    if (this.runners && this.runners.length > 0) {
      return of(this.runners);
    } else {
      return this.http.get<Runner[]>(this.url + '/runners')
        .pipe(
          map((res) => {
            return this.sortRunners(res);
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          }
          )
        );
    }
  }

  getTrainingRun(): Observable<TrainingRecord[]> {
    if (this.myTrainings && this.myTrainings.length > 0) {
      return of(this.myTrainings);
    } else {
      return this.http.get<TrainingRecord[]>(this.url + '/runners/' + this.userId + '/training-runs')
        .pipe(
          map((res: TrainingRecord[]) => {
            return this.sortTrainingRun(res);
          }),
          catchError((error: HttpErrorResponse) => {
            return throwError(error);
          })
        );
    }
  }

  getTotalMilesRun() {
    return this.runner.total_miles;
  }

  private sortTrainingRun(trainingRun: TrainingRecord[]) {
    return trainingRun.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (a.timestamp < b.timestamp) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private sortRunners(runners: Runner[]) {
    return runners.sort((a, b) => {
      if (Number(a.total_miles) > Number(b.total_miles)) {
        return -1;
      } else if (Number(a.total_miles) < Number(b.total_miles)) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private searchRunners(userId: string): number {
    let index = -1;
    for (let i = 0, len = this.runners.length; i < len; i++) {
      if (this.runners[i].id === userId) {
        index = i;
        break;
      }
    }
    return index;
  }
}
