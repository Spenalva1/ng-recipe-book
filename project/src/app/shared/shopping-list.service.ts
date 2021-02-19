import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from './ingredient.mode';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  public ingridientsChanged = new Subject<Ingredient[]>();

  private ingredientsObject = {};

  private ingredientsArr: Ingredient[] = [];

  constructor() { }

  public getIngridients(): Ingredient[] {
    return this.ingredientsArr.slice();
  }

  public addIngridient(ingredient: Ingredient): void {
    if (this.ingredientsObject[ingredient.name]) {
      this.ingredientsObject[ingredient.name] += ingredient.amount;
    } else {
      this.ingredientsObject[ingredient.name] = ingredient.amount;
    }
    this.ingredientsArr = this.igObjToArr(this.ingredientsObject);
    this.ingridientsChanged.next(this.ingredientsArr.slice());
  }

  public addIngridients(ingredients: Ingredient[]): void {
    ingredients.forEach(ig => {
      if (this.ingredientsObject[ig.name]) {
        this.ingredientsObject[ig.name] += ig.amount;
      } else {
        this.ingredientsObject[ig.name] = ig.amount;
      }
    });
    this.ingredientsArr = this.igObjToArr(this.ingredientsObject);
    this.ingridientsChanged.next(this.ingredientsArr.slice());
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
