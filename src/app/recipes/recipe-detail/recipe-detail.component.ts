import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../../shared/recipe.model';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.action';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: number;
  recipesStateSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = +param.id;
      this.recipesStateSub = this.store.select('recipes').subscribe(recipesState => {
        this.recipe = recipesState.recipes[this.id];
        if (!this.recipe) {
          this.router.navigateByUrl('/recipes');
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.recipesStateSub) {
      this.recipesStateSub.unsubscribe();
    }
  }

  public addIngreientsToShoppingList(): void {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  public onDeleteRecipe(): void {
    this.store.dispatch(new RecipesActions.RecipeDelete(this.id));
    this.router.navigateByUrl('/recipes');
  }

}
