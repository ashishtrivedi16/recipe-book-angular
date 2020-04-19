import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import {Store} from '@ngrx/store';
import * as shoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import * as recipeActions from '../store/recipes.actions';
import {map, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

    recipe: Recipe;
    id: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.route.params.pipe(
            map(params => {
                return +params.id;
            }),
            switchMap(id => {
                this.id = id;
                return this.store.select('recipes');
            }),
            map(Recipes => Recipes.recipes),
            map(recipes => {
                return recipes.find((recipe, index) => {
                    return index === this.id;
                });
            })
        ).subscribe(recipe => {
            this.recipe = recipe;
        });
    }

    onAddToShoppingList(ingredients: Ingredient[]) {
        this.store.dispatch(shoppingListActions.addIngredients({ingredients}));
    }

    onEditRecipe() {
        this.router.navigate(['edit'], {relativeTo: this.route});
    }

    onDeleteRecipe() {
        this.store.dispatch(recipeActions.deleteRecipe({index: this.id}));
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}
