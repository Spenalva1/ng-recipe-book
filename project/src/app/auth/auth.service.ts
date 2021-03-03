import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

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

  private apiKey = environment.apiKey;
  private tokenExpirationTimer: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

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

  public autoLogin(): void {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  public logout(): void {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');
    this.router.navigateByUrl('/auth');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate);
    this.store.dispatch(new AuthActions.Login({
      email: user.email,
      userId: user.id,
      token: user.token,
      expirationDate
    }));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
