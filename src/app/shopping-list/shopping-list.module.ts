import {ShoppingListComponent} from './shopping-list.component';
import {ShoppingEditComponent} from './shopping-edit/shopping-edit.component';
import {NgModule} from '@angular/core';
import {ShoppingListRoute} from './shopping-list.route';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [
        SharedModule,
        ShoppingListRoute
    ]
})
export class ShoppingListModule {
}
