import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.mode';
import { ShoppingListService } from 'src/app/shared/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, AfterViewInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('amountInput') amountInput: ElementRef;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.amountInput.nativeElement.value = 0;
  }

  onAddIngredient(): void {
    const name = (this.nameInput.nativeElement.value as string).toLowerCase();
    const amount = Number(this.amountInput.nativeElement.value);
    if (name.length > 0 && amount > 0) {
      this.shoppingListService.addIngridient(
        new Ingredient(name, amount)
      );
    }
    this.nameInput.nativeElement.value = '';
    this.amountInput.nativeElement.value = 0;
    this.nameInput.nativeElement.focus();
  }

}
