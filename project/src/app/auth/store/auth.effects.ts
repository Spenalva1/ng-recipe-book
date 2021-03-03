import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
  // tslint:disable-next-line: deprecation

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
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate
          });
        }),
        catchError(error => {
          let errorMessage = 'An unknown error occurred!';
          if (!error.error || !error.error.error || !error.error.error.message) {
            return of(new AuthActions.LoginFail(errorMessage));
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
          return of(new AuthActions.LoginFail(errorMessage));
        })
      );
    }),
  ) as any);

  authSuccess = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    map(() => {
      this.router.navigate(['/']);
    })
  ) as any, {dispatch: false});

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
