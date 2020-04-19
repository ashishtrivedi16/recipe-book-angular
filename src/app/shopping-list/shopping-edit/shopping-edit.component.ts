import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {addIngredient, deleteIngredient, stopEditing, updateIngredient} from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('f') slForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem: Ingredient;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.subscription = this.store.select('shoppingList').subscribe((stateData) => {
            const index = stateData.editIndex;
            if (index > -1) {
                this.editMode = true;
                this.editedItem = stateData.ingredients[index];
                this.slForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const ingredient = new Ingredient(value.name, value.amount);
        if (this.editMode) {
            this.store.dispatch(updateIngredient({ingredient}));
        } else {
            this.store.dispatch(addIngredient({ingredient}));
        }
        this.store.dispatch(stopEditing());
        this.editMode = false;
        this.slForm.reset();
    }

    onDelete() {
        this.store.dispatch(deleteIngredient());
        this.onClear();
    }

    onClear() {
        this.editMode = false;
        this.slForm.reset();
        this.store.dispatch(stopEditing());
    }

}
