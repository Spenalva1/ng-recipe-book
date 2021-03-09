import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class UserIsLoggedGuard implements CanActivate {

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        return user ? true : this.router.createUrlTree(['/auth']);
      })
    );
  }

}
