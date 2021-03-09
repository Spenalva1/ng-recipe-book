import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.mode';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.action';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;

  editMode: boolean;
  editItem: Ingredient;
  stateSub: Subscription;

  constructor(
    private store: Store< fromApp.AppState >
  ) { }

  ngOnInit(): void {
    this.stateSub = this.store.select('shoppingList').subscribe(state => {
      if (state.editedIngredient) {
        this.editMode = true;
        this.editItem = state.editedIngredient;
        this.slForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.stateSub.unsubscribe();
  }

  onSubmit(f: any): void {
    const name = (f.value.name as string).toLowerCase();
    const amount = Number(f.value.amount);
    if (name.length <= 0 && amount <= 0) {
      return;
    }
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(new Ingredient(name, amount)));
      this.store.dispatch(new ShoppingListActions.StopEdit());
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(new Ingredient(name, amount)));
    }
    f.reset();
    this.nameInput.nativeElement.focus();
  }

  onDeleteIngredient(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.slForm.reset();
    this.nameInput.nativeElement.focus();
  }

  onClear(): void {
    if (this.editMode) {
      this.slForm.reset();
      this.store.dispatch(new ShoppingListActions.StopEdit());
    } else {
      this.store.dispatch(new ShoppingListActions.ClearIngredients());
    }
  }

}
