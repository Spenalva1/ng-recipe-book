import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  authStateSub: Subscription;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.authStateSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  public toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onSubmit(f: NgForm): void {
    if (f.invalid) {
      return;
    }
    this.error = null;
    this.isLoading = true;
    const email = f.value.email;
    const password = f.value.password;

    let authObs: Observable<AuthResponseData| string>;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
        email,
        password
      }));
    } else {
      authObs = this.authService.signup(email, password);
      this.authService.signup(email, password);
    }
  }

}
