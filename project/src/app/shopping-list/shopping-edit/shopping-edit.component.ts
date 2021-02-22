import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.mode';
import { ShoppingListService } from 'src/app/shared/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;
  editingSub: Subscription;
  editMode: boolean;
  editItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.editingSub = this.shoppingListService.startedEditing.subscribe((name: string) => {
      if (name.length <= 0) {
        return;
      }
      this.editMode = true;
      this.editItem = this.shoppingListService.getIngredient(name);
      this.slForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount
      });
    });
  }

  ngOnDestroy(): void {
    this.editingSub.unsubscribe();
  }

  onSubmit(f: any): void {
    const name = (f.value.name as string).toLowerCase();
    const amount = Number(f.value.amount);
    if (name.length <= 0 && amount <= 0) {
      return;
    }
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editItem.name, new Ingredient(name, amount));
    } else {
      this.shoppingListService.addIngridient(
        new Ingredient(name, amount)
      );
    }
    this.editMode = false;
    f.reset();
    this.nameInput.nativeElement.focus();
  }

  onDeleteIngredient(): void {
    this.shoppingListService.deleteIngredient(this.editItem.name);
    this.editMode = false;
    this.slForm.reset();
    this.nameInput.nativeElement.focus();
  }

  onClear(): void {
    if (this.editMode) {
      this.editMode = false;
      this.slForm.reset();
      this.shoppingListService.startedEditing.next('');
    } else {
      this.shoppingListService.clearList();
    }
  }

}
