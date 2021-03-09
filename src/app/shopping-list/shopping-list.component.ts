import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.mode';
import { ShoppingListService } from '../shared/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[] = [];
  editItem: string;
  private igChangeSub: Subscription;
  private editingSub: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngridients();
    this.igChangeSub = this.shoppingListService.ingridientsChanged
    .subscribe((ingredients: Ingredient[]) => this.ingredients = ingredients);
    this.editingSub = this.shoppingListService.startedEditing.subscribe((name: string) => {
      this.editItem = name;
    });
  }

  onEditItem(name: string): void {
    this.shoppingListService.startedEditing.next(name);
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
    this.editingSub.unsubscribe();
  }
}
