import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private endpoint = environment.recipesEndpoint

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.endpoint, recipes).subscribe(resp => {
      console.log(resp);
    });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.endpoint)
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
