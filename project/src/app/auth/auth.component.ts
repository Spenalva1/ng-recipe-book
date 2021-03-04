import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  authStateSub: Subscription;
  error: string = null;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.authStateSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy(): void {
    this.authStateSub.unsubscribe();
  }

  public clearError(): void {
    this.store.dispatch(new AuthActions.ClearError());
  }

  public toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onSubmit(f: NgForm): void {
    if (f.invalid) {
      return;
    }
    const email = f.value.email;
    const password = f.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
        email,
        password
      }));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({
        email,
        password
      }));
    }
  }

}
