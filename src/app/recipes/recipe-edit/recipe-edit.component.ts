import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from 'src/app/shared/recipe.model';
import { RecipeService } from 'src/app/shared/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false; // If it´s false means that a new recipe is being created
  recipeForm: FormGroup;
  formDirty = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe( (params: Params) => {
      this.id = +params.id;
      this.editMode = params.id != null;
      this.initForm();
    });
  }

  private initForm(): void {
    const recipe = {
      name: '',
      description: '',
      imagePath: '',
      ingredients: new FormArray([])
    };
    if (this.editMode) {
      const editingRecipe =  this.recipeService.getRecipeById(this.id);
      recipe.name = editingRecipe.name;
      recipe.description = editingRecipe.description;
      recipe.imagePath = editingRecipe.imagePath;
      if (editingRecipe.ingredients) {
        editingRecipe.ingredients.forEach(ig => {
          recipe.ingredients.push(new FormGroup({
            name: new FormControl(ig.name, [Validators.required]),
            amount: new FormControl(ig.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }));
        });
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipe.name, [Validators.required]),
      imagePath: new FormControl(recipe.imagePath, [Validators.required]),
      description: new FormControl(recipe.description, [Validators.required]),
      ingredients: recipe.ingredients
    });
  }

  public onAddIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  public onDeleteIngredient(id: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(id);
    this.formDirty = true;
  }

  get controls(): any { // a getter!
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  public onCancel(): void {
    this.initForm();
  }

  public onSubmit(): void{
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.router.navigateByUrl(`/recipes/${this.id}`);
    } else {
      this.router.navigateByUrl(`/recipes/${this.recipeService.addRecipe(this.recipeForm.value)}`);
    }
  }

}
