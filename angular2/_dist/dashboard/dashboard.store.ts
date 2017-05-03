// RestService must be global (provider of the top-level module)
import { RestService } from "../core/rest.service";

import { AbstractStore } from "../core/models/abstract.store";

import { BudgetModel } from "../budgets/budget.model";
import { DocumentModel } from "../documents/document.model";
import { DiscussionModel } from "../discussions/discussion.model";

/**
 * Dashboard is a meta component, not link to any WS or Table, but aggregate different component.
 * Response API is different, and has no root data or authorization object.
 */
export class DashboardStore extends AbstractStore {

    public name: string = "dashboard";

    public budget: BudgetModel;
    public documents: Array<DocumentModel> = [];
    public discussions: Array<DiscussionModel> = [];

    constructor( protected service: RestService ) {
        super(service);
        this.budget = new BudgetModel();
    }

    public mapToModel( json: any ): void {
        this.budget.fromJson( json.budget );
    }
}