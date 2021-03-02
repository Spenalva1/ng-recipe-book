import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RecipeService } from 'src/app/shared/recipe.service';
import { Recipe } from '../../shared/recipe.model';
import * as fromApp from '../../store/app.reducer';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = +param.id;
      this.recipe = this.recipeService.getRecipeById(+this.id);
      if (!this.recipe) {
        this.router.navigateByUrl('/recipes');
      }

    });
  }

  public addIngreientsToShoppingList(): void {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  public onDeleteRecipe(): void {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigateByUrl('/recipes');
  }

}
