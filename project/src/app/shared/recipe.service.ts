import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from './ingredient.mode';
import { Recipe } from './recipe.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private shoppingListService: ShoppingListService) { }

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is a simple test',
      'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe-480x270.jpg',
      [
        new Ingredient('apple', 5),
        new Ingredient('pizza', 2),
        new Ingredient('chocolate', 15),
        new Ingredient('banana', 3)
      ]
    ),
    new Recipe(
      'A Second Test Recipe',
      'This is a simple second test',
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-crispy-chicken-thighs-garlic-rosemary-1567793052.png?crop=0.670xw:1.00xh;0.0513xw,0&resize=640:*',
      [
        new Ingredient('milk', 5),
        new Ingredient('orange', 7),
        new Ingredient('salad', 5),
        new Ingredient('water', 10)
      ]
    )
  ];

  public getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  public getRecipeById(id: number): Recipe {
    return this.recipes[id];
  }

  public addIngreientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngridients(ingredients);
  }

}
