import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user = new BehaviorSubject<User>(null);

  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  public login(email: string, password: string): Observable<AuthResponseData | string> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      { email, password, returnSecureToken: true })
    .pipe(
      catchError(this.handleError),
      tap((data: AuthResponseData) => this.handleAuthentication(data.email, data.localId, data.idToken, +data.expiresIn))
    );
  }

  public signup(email: string, password: string): Observable<AuthResponseData | string> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
      { email, password, returnSecureToken: true })
    .pipe(
      catchError(this.handleError),
      tap((data: AuthResponseData) => this.handleAuthentication(data.email, data.localId, data.idToken, +data.expiresIn))
    );
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.user.next(user);
  }

  private handleError(error: HttpErrorResponse): Observable<string> {
    let errorMessage = 'An unknown error occurred!';
    if (!error.error || !error.error.error || !error.error.error.message) {
      return throwError(errorMessage);
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'INVALID_EMAIL':
        errorMessage = 'Please enter a valid email!';
        break;
      case 'INVALID_PASSWORD':
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Incorrect credentials!';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user account has been disabled by an administrator!';
        break;
    }
    return throwError(errorMessage);
  }
}
