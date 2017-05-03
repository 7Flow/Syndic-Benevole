import { Input }        from "@angular/core";
import { Observable }   from "rxjs/Observable";

// RestService must be global (provider of the top-level module)
import { RestService }  from "../core/rest.service";

import { AbstractStore } from "../core/models/abstract.store";

import { BudgetModel }  from "../budgets/budget.model";


export class BudgetStore extends AbstractStore {

    public name: string = "budget";

    constructor( protected service: RestService ) {
        super(service);
        this.model = new BudgetModel();
    }
}