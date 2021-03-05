import { Action } from '@ngrx/store';
import { Recipe } from 'src/app/shared/recipe.model';

export const RECIPES_SET = 'RECIPES_SET';
export const RECIPE_ADD = 'RECIPE_ADD';
export const RECIPE_UPDATE = 'RECIPE_UPDATE';
export const RECIPE_DELETE = 'RECIPE_DELETE';
export const RECIPES_FETCH = 'RECIPES_FETCH';
export const RECIPES_SAVE = 'RECIPES_SAVE';

export class RecipesSet implements Action {
  readonly type = RECIPES_SET;
  constructor(public payload: Recipe[]) {}
}

export class RecipeAdd implements Action {
  readonly type = RECIPE_ADD;
  constructor(public payload: Recipe) {}
}

export class RecipeUpdate implements Action {
  readonly type = RECIPE_UPDATE;
  constructor(public payload: {id: number, recipe: Recipe}) {}
}

export class RecipeDelete implements Action {
  readonly type = RECIPE_DELETE;
  constructor(public payload: number) {}
}

export class RecipesFecth implements Action {
  readonly type = RECIPES_FETCH;
}

export class RecipesSave implements Action {
  readonly type = RECIPES_SAVE;
}

export type RecipesActions =  RecipesSet | RecipeAdd | RecipeUpdate | RecipeDelete | RecipesFecth | RecipesSave;
