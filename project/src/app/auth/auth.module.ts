import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';
import { UserNotLoggedGuard } from './user-not-logged.guard';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      { path: 'auth', canActivate: [UserNotLoggedGuard], component: AuthComponent },
    ]),
  ]
})
export class AuthModule { }
