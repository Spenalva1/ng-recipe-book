import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from 'src/app/shared/recipe.model';
import { environment } from 'src/environments/environment';
import * as RecipesActions from '../store/recipes.actions';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipesEffects {

  fetchRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.RECIPES_FETCH),
    switchMap(() => {
      return this.http.get<Recipe[]>(environment.recipesEndpoint);
    }),
    map(recipes => {
      if (!recipes) {
        return [];
      }
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    map(recipes => new RecipesActions.RecipesSet(recipes))
  ) as any);

  saveRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.RECIPES_SAVE),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(environment.recipesEndpoint, recipesState.recipes);
    })
  ) as any, {dispatch: false});

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
