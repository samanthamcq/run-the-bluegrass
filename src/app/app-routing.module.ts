import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './registration/login/login.component';
import { SignupComponent } from './registration/signup/signup.component';
import { SignupConfirmationComponent } from './registration/signup-confirmation/signup-confirmation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';
import { NewPasswordComponent } from './registration/new-password/new-password.component';
import { MainPageComponent } from './run-tracking/main-page/main-page.component';
import { LogMyRunComponent } from './run-tracking/log-my-run/log-my-run.component';
import { TrainingHistoryComponent } from './run-tracking/training-history/training-history.component';
import { LeaderBoardComponent } from './run-tracking/leader-board/leader-board.component';
import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [UnauthGuard] },
  { path: 'signupConfirmation', component: SignupConfirmationComponent, canActivate: [UnauthGuard] },
  { path: 'resetPassword', component: ResetPasswordComponent, canActivate: [UnauthGuard] },
  { path: 'newPassword', component: NewPasswordComponent, canActivate: [UnauthGuard] },
  {
    path: 'mainPage', component: MainPageComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'logMyRun', pathMatch: 'full'},
      { path: 'logMyRun', component: LogMyRunComponent, canActivate: [AuthGuard] },
      { path: 'trainingHistory', component: TrainingHistoryComponent, canActivate: [AuthGuard] },
      { path: 'leaderBoard', component: LeaderBoardComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
