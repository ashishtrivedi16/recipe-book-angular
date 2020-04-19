import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as recipeActions from '../store/recipes.actions';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

    id: number;
    editMode: boolean;
    recipeForm: FormGroup;

    private storeSub$: Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private store: Store<fromApp.AppState>) {
    }

    get controls() {
        return (this.recipeForm.get('ingredients') as FormArray).controls;
    }

    onAddIngredient() {
        (this.recipeForm.get('ingredients') as FormArray).push(new FormGroup({
            name: new FormControl(null, Validators.required),
            amount: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
            ])
        }));
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params.id;
                this.editMode = params.id != null;
                this.initForm();
            }
        );
    }

    ngOnDestroy(): void {
        if (this.storeSub$) {
            this.storeSub$.unsubscribe();
        }
    }

    onSubmit() {
        if (this.editMode) {
            this.store.dispatch(recipeActions.updateRecipe({index: this.id, newRecipe: this.recipeForm.value}));
        } else {
            this.store.dispatch(recipeActions.addRecipe({newRecipe: this.recipeForm.value}));
        }
        this.onCancel();
    }

    onCancel() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    onDeleteIngredient(index: number) {
        (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
    }

    private initForm() {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        const recipeIngredients = new FormArray([]);

        if (this.editMode) {
            this.storeSub$ = this.store.pipe(
                select('recipes'),
                map(recipes => {
                    return recipes.recipes.find((recipe, index) => {
                        return index === this.id;
                    });
                })
            ).subscribe(recipe => {
                recipeName = recipe.name;
                recipeImagePath = recipe.imagePath;
                recipeDescription = recipe.description;
                if (recipe.ingredients) {
                    for (const ingredient of recipe.ingredients) {
                        recipeIngredients.push(new FormGroup({
                            name: new FormControl(ingredient.name, Validators.required),
                            amount: new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/)
                            ])
                        }));
                    }
                }
            });
        }

        this.recipeForm = new FormGroup({
            name: new FormControl(recipeName, Validators.required),
            imagePath: new FormControl(recipeImagePath, Validators.required),
            description: new FormControl(recipeDescription, Validators.required),
            ingredients: recipeIngredients
        });
    }

}
