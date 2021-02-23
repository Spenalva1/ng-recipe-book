import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/shared/recipe.service';
import { Recipe } from '../../shared/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  recipesSub: Subscription;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.recipesSub = this.recipeService.recipesChanged.subscribe(recipes => this.recipes = recipes);
  }

  ngOnDestroy(): void {
    this.recipesSub.unsubscribe();
  }

}
