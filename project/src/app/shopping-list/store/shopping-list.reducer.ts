import { Ingredient } from 'src/app/shared/ingredient.mode';
import * as ShoppingListActions from './shopping-list.action';

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
}

const initialState: State = {
  ingredients: [],
  editedIngredient: null
};

let ingredientsObject = {};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions): any {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      AddIngredient(action.payload);
      return {
        ...state,
        ingredients: [...igObjToArr(ingredientsObject)]
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      action.payload.forEach(ig => {
        AddIngredient(ig);
      });
      return {
        ...state,
        ingredients: [...igObjToArr(ingredientsObject)]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      updateIngredient(state.editedIngredient.name, action.payload);
      return {
        ...state,
        ingredients: [...igObjToArr(ingredientsObject)]
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      deleteIngredient(state.editedIngredient.name);
      return {
        ...state,
        ingredients: [...igObjToArr(ingredientsObject)]
      };

    case ShoppingListActions.CLEAR_INGREDIENTS:
      ingredientsObject = {};
      return {
        ...state,
        ingredients: []
      };

    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredient: action.payload
      };

    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null
      };

    default:
      return state;
  }
}

function AddIngredient(ig: Ingredient): void {
  if (ingredientsObject[ig.name]) {
    ingredientsObject[ig.name] += ig.amount;
  } else {
    ingredientsObject[ig.name] = ig.amount;
  }
}

function igObjToArr(obj: any): Ingredient[]{
  const igs = [];
  Object.keys(obj).forEach((key: string) => igs.push(new Ingredient(key, obj[key])));
  igs.sort((a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name));
  return igs.slice();
}

function updateIngredient(name: string, ingredient: Ingredient): void{
  if (ingredientsObject[name]) {
    delete ingredientsObject[name];
    ingredientsObject[ingredient.name] = ingredient.amount;
  }
}

function deleteIngredient(name: string): void {
  if (ingredientsObject[name]) {
    delete ingredientsObject[name];
  }
}
