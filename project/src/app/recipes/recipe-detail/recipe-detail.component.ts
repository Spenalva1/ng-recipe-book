import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/shared/recipe.service';
import { Recipe } from '../../shared/recipe.model';

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
    private router: Router
  ) {  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.id = +param.id;
      this.recipe = this.recipeService.getRecipeById(+this.id);
      if (!this.recipe) {
        this.router.navigateByUrl('/recipes')
      }

    });
  }

  public addIngreientsToShoppingList(): void {
    this.recipeService.addIngreientsToShoppingList(this.recipe.ingredients);
  }

}
