import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
      this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigateByUrl('/recipes');
      },
      error => {
        console.error(error);
        this.error = error;
        this.isLoading = false;
      }
    );
  }

}
