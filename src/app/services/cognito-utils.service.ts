import { Injectable } from '@angular/core';
import { Config } from 'src/environments/environment';

@Injectable()
export class CognitoUtils {
  public static getAPIURL(): string {
    return Config.API_URL;
  }

  public static getUserFirstName(): string {
    return localStorage.getItem('userFirstName');
  }

  public static setUserFirstName(userFirstName: string) {
    localStorage.setItem('userFirstName', userFirstName);
  }

  public static getUserLastName(): string {
    return localStorage.getItem('userLastName');
  }

  public static setUserLastName(userLastName: string) {
    localStorage.setItem('userLastName', userLastName);
  }

  public static setUserEmail(userEmail: string) {
    localStorage.setItem('userEmail', userEmail);
  }

  public static getUserEmail(): string {
    return localStorage.getItem('userEmail');
  }

  public static getUserId(): string {
    return localStorage.getItem('userId');
  }

  public static setUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  public static clearUserStorage() {
    localStorage.clear();
  }
}

