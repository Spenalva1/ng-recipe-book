import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;

  collapsed = true;
  isAuthenticated = false;


  constructor(
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(
      map(authState => authState.user)
    ).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  public onLogout(): void {
    this.store.dispatch(new AuthActions.Logout());
  }

  public onSaveData(): void {
    this.store.dispatch(new RecipesActions.RecipesSave());
  }

  public onFetchData(): void {
    this.store.dispatch(new RecipesActions.RecipesFecth());
  }
}
