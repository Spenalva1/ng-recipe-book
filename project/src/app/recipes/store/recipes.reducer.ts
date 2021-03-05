import { Recipe } from 'src/app/shared/recipe.model';
import * as RecipesActions from './recipes.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipesReducer(state = initialState, action: RecipesActions.RecipesActions ): any {
  switch (action.type) {
    case RecipesActions.RECIPES_SET:
      return {
        ...state,
        recipes: action.payload
      };

    case RecipesActions.RECIPE_ADD:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };

    case RecipesActions.RECIPE_UPDATE:
      const recipes = [...state.recipes];
      recipes[action.payload.id] = action.payload.recipe;
      return {
        ...state,
        recipes
      };

    case RecipesActions.RECIPE_DELETE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, i) => i !== action.payload )
      };

    default:
      return state;
  }
}
