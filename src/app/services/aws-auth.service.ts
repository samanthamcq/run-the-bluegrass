import { Injectable } from '@angular/core';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { CognitoUtils } from './cognito-utils.service';

@Injectable(
  { providedIn: 'root' }
)
export class AwsAuthService {
  constructor() {
  }

  authenticateUser(username: string, password: string): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username.toLowerCase(), password)
        .then((user: CognitoUser | any) => {
          CognitoUtils.setUserFirstName(user.attributes.given_name);
          CognitoUtils.setUserLastName(user.attributes.family_name);
          CognitoUtils.setUserEmail(user.attributes.email);
          CognitoUtils.setUserId(user.username);
          resolve(user);
        }).catch((error: any) => reject(error));
    }
    );
  }

  registerNewUser(firstname: string, lastname: string, email: string, password: string): Promise<CognitoUser | any> {
    return new Promise((resolve, reject) => {
      Auth.signUp({
        username: email.toLowerCase(),
        password: password,
        attributes: {
          email: email.toLowerCase(),
          given_name: firstname,
          family_name: lastname
        }
      })
        .then((data: ISignUpResult) => {
          resolve(data.user);
        })
        .catch((error: any) => reject(error));
    });
  }

  logOut(): Promise<any> {
    return Auth.signOut()
      .then(() => CognitoUtils.clearUserStorage());
  }

  forgotPassword(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.forgotPassword(username)
        .then(() => {
          resolve();
        })
        .catch((error: any) => reject(error));
    });
  }

  createNewPassword(username: string, code: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.forgotPasswordSubmit(username, code, password)
        .then(() => {
          resolve();
        })
        .catch((error: any) => reject(error));
    });
  }
}
