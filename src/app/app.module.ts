import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './registration/login/login.component';
import { SignupComponent } from './registration/signup/signup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupConfirmationComponent } from './registration/signup-confirmation/signup-confirmation.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';
import { NewPasswordComponent } from './registration/new-password/new-password.component';
import { MainPageComponent } from './run-tracking/main-page/main-page.component';
import { LogMyRunComponent } from './run-tracking/log-my-run/log-my-run.component';
import { TrainingHistoryComponent } from './run-tracking/training-history/training-history.component';
import { LeaderBoardComponent } from './run-tracking/leader-board/leader-board.component';
import { httpInterceptorProviders } from './interceptors/http-interceptor-providers';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    SignupConfirmationComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    MainPageComponent,
    LogMyRunComponent,
    TrainingHistoryComponent,
    LeaderBoardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
