import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  authSignup = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(data => {
          this.authService.setLogoutTimer(+data.expiresIn * 1000);
          return this.handleAuth(data);
        }),
        catchError(this.handleError)
      );
    }),
  ) as any);

  authLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(data => {
          this.authService.setLogoutTimer(+data.expiresIn * 1000);
          return this.handleAuth(data);
        }),
        catchError(this.handleError)
      );
    }),
  ) as any);

  authAutoLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'No User'};
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      if (loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        });
      }
      return {type: 'No User'};
    })
  ) as any);

  authLogout = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    map(() => {
      localStorage.removeItem('userData');
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  ) as any, {dispatch: false});

  authSuccess = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    map(() => {
      this.router.navigate(['/']);
    })
  ) as any, {dispatch: false});

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handleAuth(data: AuthResponseData): AuthActions.AuthSuccess {
    const expirationDate = new Date(new Date().getTime() + +data.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(new User(
      data.email,
      data.localId,
      data.idToken,
      expirationDate,
    )));
    return new AuthActions.AuthSuccess({
      email: data.email,
      userId: data.localId,
      token: data.idToken,
      expirationDate
    });
  }

  private handleError(error: HttpErrorResponse): Observable<AuthActions.AuthFail> {
    console.log(error);

    let errorMessage = 'An unknown error occurred!';
    if (!error.error || !error.error.error || !error.error.error.message) {
      return of(new AuthActions.AuthFail(errorMessage));
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
    return of(new AuthActions.AuthFail(errorMessage));
  }
}
