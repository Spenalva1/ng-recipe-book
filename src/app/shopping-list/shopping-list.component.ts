import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.mode';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  stateSub: Subscription;
  ingredients: Ingredient[] = [];
  editItem: Ingredient;

  constructor(
    private store: Store< fromApp.AppState >
  ) { }

  ngOnInit(): void {
    this.stateSub = this.store.select('shoppingList').subscribe(state => {
      this.ingredients = state.ingredients;
      this.editItem = state.editedIngredient;
    });
  }

  ngOnDestroy(): void {
    this.stateSub.unsubscribe();
  }

  onEditItem(ig: Ingredient): void {
    this.editItem = ig;
    this.store.dispatch(new ShoppingListActions.StartEdit(ig));
  }
}
