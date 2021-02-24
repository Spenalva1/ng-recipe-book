import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;

  constructor(
    private authService: AuthService
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
    const email = f.value.email;
    const password = f.value.password;
    console.log(email, password);

    if (this.isLoginMode) {
      //login
    } else {
      this.authService.signup(email, password).subscribe(
        resData => {
          console.log(resData);
        },
        error => {
          console.log(error);
        }
      )
    }
    f.reset();
  }

}
