import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from './ingredient.mode';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  public ingridientsChanged = new Subject<Ingredient[]>();
  public startedEditing = new Subject<string>();

  private ingredientsObject = {};
  private ingredientsArr: Ingredient[] = [];

  constructor() { }

  public getIngridients(): Ingredient[] {
    return this.ingredientsArr.slice();
  }

  public getIngredient(name: string): Ingredient{
    if (this.ingredientsObject[name]) {
      return new Ingredient(name, this.ingredientsObject[name]);
    }
    return null;
  }

  public deleteIngredient(name: string): void {
    if (this.ingredientsObject[name]) {
      delete this.ingredientsObject[name];
      this.startedEditing.next('');
      this.ingredientsUpdate();
    }
  }

  public updateIngredient(name: string, ingredient: Ingredient): void{
    if (this.ingredientsObject[name]) {
      delete this.ingredientsObject[name];
      this.ingredientsObject[ingredient.name] = ingredient.amount;
      this.startedEditing.next('');
      this.ingredientsUpdate();
    }
  }

  private ingredientsUpdate(): void{
    this.ingredientsArr = this.igObjToArr(this.ingredientsObject);
    this.ingredientsArr.sort((a, b) => a.name.localeCompare(b.name));
    this.ingridientsChanged.next(this.ingredientsArr.slice());
  }

  public addIngridient(ingredient: Ingredient): void {
    if (this.ingredientsObject[ingredient.name]) {
      this.ingredientsObject[ingredient.name] += ingredient.amount;
    } else {
      this.ingredientsObject[ingredient.name] = ingredient.amount;
    }
    this.ingredientsUpdate();
  }

  public addIngridients(ingredients: Ingredient[]): void {
    ingredients.forEach(ig => {
      if (this.ingredientsObject[ig.name]) {
        this.ingredientsObject[ig.name] += ig.amount;
      } else {
        this.ingredientsObject[ig.name] = ig.amount;
      }
    });
    this.ingredientsUpdate();
  }

  private igObjToArr(obj: any): Ingredient[]{
    const igs = [];
    Object.keys(obj).forEach((key: string) => igs.push(new Ingredient(key, obj[key])));
    return igs;
  }

  public clearList(): void {
    this.ingredientsArr = [];
    this.ingredientsObject = {};
    this.ingridientsChanged.next(this.ingredientsArr.slice());
  }
}
