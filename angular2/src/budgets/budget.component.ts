import { Component, OnInit, AfterContentInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Http, Response }           from "@angular/http";
import { FormsModule }              from "@angular/forms";
import { CommonModule }             from "@angular/common";


import { USER }                     from "../app/app.global";

import { BudgetStore }              from "./budget.store";

/* child component must be declared by a top-module (usually the router module) */
import { FoundDetailsComponent }    from "../founds/founddetails.component";
import { FoundModel }               from "../founds/found.model";

import { FoundAddComponent }        from "../founds/found.add.component";


@Component({
    selector: "section",
    templateUrl: "../../templates/budget/one.html",
    providers: [
        BudgetStore
    ]
})

export class BudgetComponent implements OnInit, AfterContentInit {

    @ViewChild( FoundAddComponent ) addModal: FoundAddComponent;
    private subscription: any;

    public newFound: FoundModel = new FoundModel();



    // We inject the router via DI
    constructor( private router: Router, private route: ActivatedRoute, protected store: BudgetStore ) {
        console.log("[BudgetComponent]");
    }

    ngOnInit() {
        this.store.GET( this.route.params );
        this.store.signal.subscribe( this.storeReady.bind(this) );
    }

    ngAfterContentInit() {
        // console.log( this.confirmModal );
    }

    /**
     * Child component output event.
     * @param event
     */
    isFoundReady( found: FoundModel ) {

    }

    /**
     * Store complete event
     */
    storeReady( result: any ): void {
        this.newFound.fk_budget_id = this.store.model.budget_id;
    }

    public add(): void {
        this.addModal.open();
        this.subscription = this.addModal.observable.subscribe( (confirm: boolean) => {

            this.subscription.unsubscribe();
        });
    }
}